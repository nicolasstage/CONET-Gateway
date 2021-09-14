/*!
 * Copyright 2018 CoNET Technology Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

///

import { connect } from 'tls'
import { Transform } from 'stream'
import { EventEmitter } from 'events'
import { v4 } from 'uuid'
import { waterfall, series, eachSeries } from 'async'
import { createHash, randomBytes } from 'crypto'
import { setTimeout, clearTimeout } from 'timers';
import { Buffer } from 'buffer'
import { inspect }  from 'util'
import type { TLSSocket } from 'tls'

export const logger = (...argv: any ) => {
    const date = new Date ()
    let dateStrang = `[${ date.getHours() }:${ date.getMinutes() }:${ date.getSeconds() }:${ date.getMilliseconds ()}] `
    return console.log ( dateStrang, ...argv )
}

const MAX_INT = 9007199254740992
const debug = true
const NoopWaitintTimeout = 100
const NoopLoopWaitingTime = 1000 * 1

export const saveLog = ( log: string, _console: boolean = true ) => {

    const data = `${ new Date().toUTCString () }: ${ log }\r\n`
    _console ? console.log ( data ) : null
}

const debugOut = ( text: string, isIn: boolean, serialID: string ) => {
    const date = new Date ()
    const log = `【${ date.getHours() }:${ date.getMinutes() }:${ date.getSeconds() }:${ date.getMilliseconds ()}】【${ serialID }】${ isIn ? '<=' : '=>'} 【${ text }】`
    console.log ( log )

}

const idleInterval = 1000 * 60 * 15    // 5 mins

class ImapServerSwitchStream extends Transform {

    public commandProcess: ( text: string, cmdArray: string[], next: ( err?: Error| null, str?: string ) => void, callback: () => void ) => void = () => {}
    public name = ''
    public _buffer = Buffer.alloc (0)
    public serverCommandError ( err: Error, _CallBack: ( err?: Error ) => void ) {
        this.imapServer.emit ( 'error', err )
        if ( _CallBack ) {
            _CallBack ( err )
        }

    }

    public Tag = ''
    public cmd = ''
    public callback = false
    public doCommandCallback: ( Err?: Error| null , commandLine?: string ) => void = () => {}
    private _login = false
    private first = true
    public waitLogout = null
    public waitLogoutCallBack: any
    public idleResponsrTime: NodeJS.Timer | null = null
    private ready = false
    public appendWaitResponsrTimeOut: NodeJS.Timer|null = null
    public runningCommand = ''
    //private nextRead = true
    public idleNextStop: NodeJS.Timer|null = null
    private idleCallBack: any
    private reNewCount = 0
    private isImapUserLoginSuccess = false

    private newSwitchRet = false
    private doingIdle = false
    private needLoginout = false
	private needLoginout_Callback: () => void = () => {}
    private fetchEmptyBody = false
    private isFetchBodyFinished = false
    private idleDoingDone = false
    private MicrosoftExchange = false
    public canDoLogout = false
    private currentUid = 0

    public idleDoingDown () {
        if ( this.idleNextStop ) {
		clearTimeout ( this.idleNextStop )
        }
		if ( this.idleDoingDone || this.runningCommand !== 'idle') {
			return logger (`idleDoingDown but this.idleDoingDone = [${ this.idleDoingDone }] or this.runningCommand !== 'idle' ${ this.runningCommand }`) 
		}
		if ( this.writable ) {
			this.idleDoingDone = true
			this.debug ? debugOut ( `DONE`, false, this.imapServer.listenFolder || this.imapServer.imapSerialID ) : null
            console.log('')
			return this.push (`DONE\r\n`)
		}
		return this.imapServer.destroyAll ( null )
		
	}


    constructor ( public imapServer: qtGateImap, private exitWithDeleteBox: boolean, public debug: boolean  ) {
        super ()
    }


    private doCapability ( capability: string ) {
        this.imapServer.serverSupportTag = capability
        this.imapServer.idleSupport = /IDLE/i.test ( capability )
        this.imapServer.condStoreSupport = /CONDSTORE/i.test ( capability )
        this.imapServer.literalPlus = /LITERAL\+/i.test ( capability )
        const ii = /X\-GM\-EXT\-1/i.test ( capability )
        const ii1 = /CONDSTORE/i.test ( capability )
        return this.imapServer.fetchAddCom = `(${ ii ? 'X-GM-THRID X-GM-MSGID X-GM-LABELS ': '' }${ ii1 ? 'MODSEQ ' : ''}BODY[])`
    }

    public preProcessCommane ( commandLine: string, _next:() => void, callback:() => void ) {
		
		commandLine = commandLine.replace( /^ +/g,'').replace (/^IDLE\*/, '*')
		
        const cmdArray = commandLine.split (' ')
        this.debug ? debugOut ( `${ commandLine }`, true, this.imapServer.listenFolder || this.imapServer.imapSerialID ) : null

        if ( this._login ) {
            switch ( commandLine[0] ) {

                case '+':                                    /////       +
                case 'C':
                case '*': {                                  /////       *
					
                    return this.commandProcess ( commandLine, cmdArray, _next, callback )
                }
				
                case 'I':           //  IDLE
                case 'D':           //  NODE
				case 'N':           //  NOOP
				case 'O':			//	OK
                case 'A': {                                 /////       A
                    if ( this.appendWaitResponsrTimeOut ) {
                        clearTimeout ( this.appendWaitResponsrTimeOut )
                    }
                    if ( this.idleResponsrTime) {
                        clearTimeout ( this.idleResponsrTime )
                    }
					
					//console.log (`preProcessCommane 【 OK 】`)
                    this.runningCommand = ''
                    
                    if ( /^ok$/i.test ( cmdArray[1] ) || /^ok$/i.test ( cmdArray[0] )) {
                        if ( this.doCommandCallback ) {
                            this.doCommandCallback ( null, commandLine )
                        }
                        
                        return callback ()
					}
					if ( this.Tag !== cmdArray[0] ) {
                        return this.serverCommandError ( new Error ( `this.Tag[${ this.Tag }] !== cmdArray[0] [${ cmdArray[0] }]\ncommandLine[${ commandLine }]` ), callback )
                    }
                    const errs = cmdArray.slice (2).join(' ')

                    if ( /IDLE/i.test( commandLine )) {
                        this.end ()
                    }
                    this.doCommandCallback ( new Error ( errs ))

                    return callback ()

                }
                default: {
					return this.serverCommandError ( new Error (`_commandPreProcess got switch default error! command = [${ this.Tag }] commandLine = ${ commandLine }` ), callback )
				}
                    
            }
		}

		if ( /Microsoft Exchange/i.test ( commandLine )) {

			this.MicrosoftExchange = true

			console.log (`*************** Microsoft Exchange mail server!! ********************`)
		}
        return this.login ( commandLine, cmdArray, _next, callback )
    }

    public checkFetchEnd () {
        if ( this._buffer.length <= this.imapServer.fetching ) {
            return null
        }
        
        const body = this._buffer.slice ( 0, this.imapServer.fetching )
        const uu = this._buffer.slice ( this.imapServer.fetching )
        
        let index1 = uu.indexOf ('\r\n* ')
        let index = uu.indexOf ('\r\nA') 

        index = index < 0 || index1 > 0 && index > index1 ? index1 : index

        if ( index < 0 )
            return null

        this._buffer = uu.slice ( index + 2 )
        this.imapServer.fetching = 0
        return body

    }

    private checkLine ( next : () => void ) {
        // /console.log (`__CallBack\n\nthis._buffer = [${ this._buffer.toString() }] [${ this._buffer.toString ('hex')}]`)

        let index = -1
        /**
         * 		check line
         */
        if ( !this._buffer.length || ( index = this._buffer.indexOf ( '\r\n' )) < 0 ) {

            //      this is for IDLE do DONE command
            //		this.emit ( 'hold' )
            if ( ! this.callback ) {
                this.callback = true
                return next()
            }

            //      did next with other function
            return
        }

        const _buf = this._buffer.slice ( 0, index )

        this.preProcessCommane ( _buf.toString (), next, () => {
            //		delete '\r\n'
            this._buffer = this._buffer.slice ( index + 2 )
            return this.doLine ( next )
        })

		return
    }

    private doLine ( next: () => void ) {
		if ( this.imapServer.fetching ) {
			//console.log ('************************************** ImapServerSwitchStream _transform chunk **************************************')
			//console.log ( this._buffer.toString ())
			//console.log ('************************************** ImapServerSwitchStream _transform chunk **************************************')
			const _buf1 = this.checkFetchEnd ()
			
			//  have no fill body must goto  next chunk
			if ( ! _buf1 ) {
				
				this.callback = true
				return next ()
			}
			
			//console.log ('************************************** ImapServerSwitchStream _transform chunk **************************************')
			//console.log ( `\n\n_buf1.length = [${ _buf1.length }]\n\n` )
			//console.log ( _buf1.toString ())
			
			this.isFetchBodyFinished = true 
			this.imapServer.newMail ( _buf1 )
			
		}

		return this.checkLine ( next )
    }

    public _transform ( chunk: Buffer, encoding: string, next: () => void ) {

        this.callback = false
        //console.log ('************************************** ImapServerSwitchStream _transform chunk **************************************')
        //console.log ( chunk.toString ())
        //console.log ('************************************** ImapServerSwitchStream _transform chunk **************************************')
        this._buffer = Buffer.concat ([ this._buffer, chunk ])
        return this.doLine ( next )
    }

    private capability () {

        this.doCommandCallback = ( err ) => {
			if (err) {
				logger (inspect(`capability error`))
				return this.imapServer.destroyAll (err)
			}
            if ( this.imapServer.listenFolder ) {
                
                return this.openBox ( true, ( err, newMail ) => {
                    
                    if ( err ) {
                        console.log (`********************************this.openBox CallBack err= [${ err }] ***************************************\n\n`)
                        return this.imapServer.destroyAll( err )
					}
					this.imapServer.emit ( 'openBoxReady' )
                    if ( /^inbox$/i.test ( this.imapServer.listenFolder )) {
                        
                        return this.canDoLogout = this.ready = true
                    }

                    if ( newMail ) {
                        return this.doNewMail ()
					}
					
					this.canDoLogout = true
					
                    return this.idleNoop (null)
                })
            }
            
            this.canDoLogout = this.ready = true
            this.imapServer.emit ( 'ready' )
        }

        this.commandProcess = ( text: string, cmdArray: string[], next, callback ) => {
            switch ( cmdArray[0] ) {
                case '*': {                                  /////       *
                    //          check imap server is login ok
                    if ( /^CAPABILITY$/i.test ( cmdArray [1] ) && cmdArray.length > 2 ) {
                        const kkk = cmdArray.slice (2).join (' ')
                        this.doCapability ( kkk )
                    }
                    return callback ()
                }
                default:
                return callback ()
            }
        }

        this.Tag = `A${ this.imapServer.TagCount1() }`
        this.cmd = `${ this.Tag } CAPABILITY`
        this.debug ? debugOut ( this.cmd, false, this.imapServer.listenFolder || this.imapServer.imapSerialID ) : null

        if ( this.writable ) {
            return this.push ( this.cmd + '\r\n')
        }
        console.log (`\n\n*************************** imap capability error! this.writable === false doing destroyAll ()*************************** \n\n`)
        return this.imapServer.destroyAll (null)
    }

    private skipAllUnreadMail () {

        return this.seachUnseen (( err, newMailIds ) => {
            if ( newMailIds ) {


                return series ([
                    next => this.flagsDeleted ( newMailIds, next ),
                    next => this.expunge ( next )
                ], err => {
                    this.runningCommand = ''
                    this.imapServer.emit ( 'ready' )
                    return this.idleNoop(null)
                })
            }
            this.runningCommand = ''
            this.imapServer.emit ( 'ready' )
            return this.idleNoop(null)
        })
    }

    public doNewMail ( UID: string = '' ) {

        this.reNewCount --
		this.canDoLogout = true
		this.newSwitchRet = false
                
		this.canDoLogout = false
		this.runningCommand = 'doNewMail'

        return this.seachUnseen (( err?: Error| null, newMailIds?: string, havemore?: boolean ) => {
            if ( err ) {
                console.log (`===============> seachUnseen got error. destore imap connect!`, err )
                this.runningCommand = ''
                this.imapServer.destroyAll ( err )
				return 
            }

            if (! newMailIds || ! newMailIds.length ) {
				
				this.runningCommand = ''
				return this.idleNoop(null)
			}

            let haveMoreNewMail = false


			const uids = newMailIds.split (',')
			const newMail: number[] = []
			uids.forEach (n => {
				const nn = parseInt (n)
				if ( nn > this.currentUid ) {
					newMail.push (nn)
					this.currentUid = nn
				}
			})

			eachSeries ( newMail, ( n ,next ) => this.fetch ( n.toString(), next )
			, err => {
				return series ([
					next => this.flagsDeleted ( newMailIds, next ),
					next => this.expunge ( next )
				], ( err, newM ) => {
					//console.log (`\n\ndoNewMail success!\n\n`)
					this.runningCommand = ''
					if ( err ) {
						saveLog ( `ImapServerSwitchStream [${ this.imapServer.listenFolder }] doNewMail ERROR! [${ err.message }]`)
						return this.imapServer.destroyAll ( err )
					}

					if ( haveMoreNewMail || havemore || this.newSwitchRet || newM ) {
						console.log (`\n\ndoNewMail again!\n\n`)
						return this.doNewMail ()
					}
					//console.log (`\n\ndoNewMail call idleNoop() !\n\n`)
					return this.idleNoop( null )
				})
				
			})
        })
    }

    public _logout ( callabck: () => void) {
        if ( !this.isImapUserLoginSuccess ) {
            return callabck ()
        }
        
        this.doCommandCallback = callabck
        if ( this.idleResponsrTime ) {
            clearTimeout ( this.idleResponsrTime )
        }
       

        this.commandProcess = ( text: string, cmdArray: string[], next, _callback ) => {
            this.isImapUserLoginSuccess = false
            return _callback ()

        }

        this.Tag = `A${ this.imapServer.TagCount1() }`
        this.cmd = `${ this.Tag } LOGOUT`
        this.debug ? debugOut ( this.cmd, false, this.imapServer.listenFolder || this.imapServer.imapSerialID ) : null
        
        if ( this.writable ) {
            return this.push ( this.cmd + '\r\n')
        }
        if ( callabck && typeof callabck === 'function') {
            
            return callabck()
        }
        
    }

    public logout_process () {
		
		const CallBack = () => {
			if ( this.waitLogoutCallBack && typeof this.waitLogoutCallBack === 'function') {
                return this.waitLogoutCallBack ()
            }
		}

        if ( ! this.writable ) {
            console.trace ( `logout_process [! this.writable] run return callback ()`)
            return CallBack ()
            
        }
            
        const doLogout = () => {
            return this._logout ( CallBack )
		}
		
        if ( this.imapServer.listenFolder && this.runningCommand ) {
            saveLog  (`logout_process [this.imapServer.listenFolder && this.runningCommand], doing this.idleStop ()`)
            this.idleCallBack = doLogout
            return this.idleDoingDown ()
        }

        doLogout ()
	}

    public idleNoop ( CallBack: any ) {
		if ( this.waitLogout || this.imapServer.exit_when_idle ) {
			console.log (`\n\n******************** idleNoop this.waitLogout === [true] ***********************\n\n` )
			return this.logout_process ()
		}

		this.idleDoingDone = false
        this.canDoLogout = true

		this.newSwitchRet = false
		this.runningCommand = 'idle'
		
		if ( ! this.ready ) {
			this.ready = true
			this.imapServer.emit ( 'ready' )
		}
		if ( CallBack ) {
            this.idleCallBack = CallBack
        }

		this.doCommandCallback = ( err => {

			if ( err ) {
				console.log (`this.doCommandCallback error`, err )
				return this.imapServer.destroyAll ( null )
			}
			//this.debug ? debugOut ( 'IDLE this.doCommandCallback', false, this.imapServer.IMapConnect.imapUserName ) : null
			this.runningCommand = ''
			
			if ( this.idleCallBack ) {
				logger (`idleNoop ----->     this.idleCallBack!!!`)
				this.idleCallBack ()
				return this.idleCallBack = null
			}

			//console.log(`IDLE DONE newSwitchRet = [${newSwitchRet}] nextRead = [${this.nextRead}]`)
			if ( this.newSwitchRet || this.reNewCount > 0 ) {
                if ( CallBack ) {
                    return CallBack ()
                    
                }
                return this.doNewMail ()
			}
			//      support microsoft IDLE issue!
			if ( this.imapServer.idleSupport ) {
                if ( this.MicrosoftExchange ) {
				    return this.logout_process ()
                }
                return this.idleNoop (null)
			}
			
			setTimeout (() => {
				if ( !this.runningCommand ) {
					return this.idleNoop (null)
				}
				
			}, NoopWaitintTimeout )

		})

        if ( !CallBack ) {
            this.idleNextStop = this.imapServer.idleSupport
			? setTimeout (() => {
				this.idleDoingDown ()
			}, idleInterval )
			: null
        }
		
			
		this.commandProcess = (  text: string, cmdArray: string[], next, callback ) => {
			
			let kk = cmdArray[0]
			if ( kk.length > 1 ) {
				kk = kk[ length - 1 ]
			}
			//console.log (`IDLE commandProcess ! =====================> cmdArray[0] [${ cmdArray[0] }] kk [${ kk }]`)
			switch ( kk ) {
				
				case '+':
				case '*': {
					/**
					 * 			Seupport Microsoft Exchange IMAP4
					 */
					if ( /BYE Connection closed/i.test ( cmdArray[0] )) {
						return this.imapServer.destroyAll ( new Error (`ERROR: BYE Connection closed `))
					}
                    if ( this.idleResponsrTime ) {
                        clearTimeout ( this.idleResponsrTime )
                    }
					
					if ( /^RECENT$|^FETCH$|^EXISTS$|^EXPUNGE$/i.test ( cmdArray[2] )) {
						
						this.newSwitchRet = true
					}
					if ( /^RECENT$|^EXISTS$|^FETCH$/i.test ( cmdArray[2] ) || this.waitLogout ) {
						if ( this.imapServer.idleSupport ) {
							this.idleDoingDown()
						}
						
					}
					
					return callback ()
				}
				default:
				return callback ()
			}
		}
		
		const name = this.imapServer.idleSupport ? 'IDLE' : 'NOOP'
		this.Tag = `${ name }`
		this.cmd = `${ this.Tag } ${ name }`
		
		//const cc = Crypto.randomBytes (10).toString('base64')
		
		this.debug ? debugOut ( this.cmd, false, this.imapServer.listenFolder || this.imapServer.imapSerialID) : null
		if ( this.writable ) {
			return this.push ( this.cmd + '\r\n')
		}
		
		return this.imapServer.destroyAll ( null )
        
    }

    public loginoutWithCheck ( CallBack: () => void ) {
        if ( this.needLoginout ) {
			console.log ( inspect ({ "loginoutWithCheck this.needLoginout already have ": new Error ()}, false, 3, true ))
            return CallBack ()
        }
		this.needLoginout = true
        this.needLoginout_Callback = CallBack
        if ( this.runningCommand === 'doNewMail' ) {
            return
        }
        if ( this.doingIdle ) {
            return this.idleDoingDown ()
        }

    }

    private login ( text: string, cmdArray: string[], next: ( Err?: Error| null, cmd?: string ) => void, _callback: () => void ) {

        //console.log ( `login process!` )
		let loginTimeOut: NodeJS.Timeout
		const loginTime = 1000 * 30
        this.doCommandCallback = ( err ) => {
            clearTimeout ( loginTimeOut )
            if ( ! err ) {
                this.isImapUserLoginSuccess = true
                return this.capability ()
            }
            
            return this.imapServer.destroyAll ( err )
        }

        this.commandProcess = (  text: string, cmdArray: string[], next, callback ) => {
			
            switch ( cmdArray[0] ) {
                case '+':
                case '*': {
                    return callback ()
                }
                default:
                return callback ()
            }
        }
        
        switch ( cmdArray[0] ) {
            
            case '*': {                                  /////       *
                //          check imap server is login ok
                if ( /^ok$/i.test ( cmdArray [1]) && this.first ) {
                    this.first = false
                    this.Tag = `A${ this.imapServer.TagCount1() }`
                    this.cmd = `${ this.Tag } LOGIN "${ this.imapServer.IMapConnect.imapUserName }" "${ this.imapServer.IMapConnect.imapUserPassword }"`
                    this.debug ? debugOut ( this.cmd, false, this.imapServer.listenFolder || this.imapServer.imapSerialID ) : null
                    this.callback = this._login = true
                    if ( this.writable ) {
						loginTimeOut = setTimeout (() => {
							logger (inspect(`loginTimeOut ERROR! this.imapServer.destroyAll ( new Error ('Login timeout!') )`, false, 3, true ))
							return this.doCommandCallback (new Error ('login timeout!'))
						}, loginTime )
						return next ( null, this.cmd + '\r\n' )
					}
                    
                    return next (new Error ('!writable'))
                }
                //
                return _callback ()
            }
            default:{
				return this.serverCommandError ( new Error ( `login switch default ERROR!` ), _callback )
			}
            
            
        }

    }

    public createBox ( openBox: boolean, folderName: string, CallBack: (err?: Error| null| undefined , newMail?: boolean, UID?: string ) => void ) {

        this.doCommandCallback = ( err ) => {
			
            if ( err ) {
                const err1 = err.message
				if ( /exists/i.test ( err1 )) {
					if ( openBox ) {
						return this.openBox ( false, CallBack )
					}
                    return CallBack ()
                }
				/**
				 * 		support iCloud mail server
				 * 		The Box success created but still return UNAVAILABLE ERROR
				 */
				if ( /UNAVAILABLE/i.test ( err1 )) {
					if ( openBox ) {
						return this.openBox ( false, CallBack )
					}
					return CallBack ()
				}
				return CallBack ( err )
			}
            
            if ( openBox ) {
                return this.openBox ( false, CallBack )
            }
            return CallBack ()
		}
		
        this.commandProcess = ( text: string, cmdArray: string[], next, callback ) => {

            return callback ()
        }
        this.Tag = `A${ this.imapServer.TagCount1() }`
        this.cmd = `${ this.Tag } CREATE "${ folderName }"`
        this.debug ? debugOut ( this.cmd, false, folderName || this.imapServer.imapSerialID ) : null
        if ( this.writable ) {
            return this.push ( this.cmd + '\r\n')
        }
        
        return this.imapServer.destroyAll ( null )

    }

    public openBox ( create: boolean, CallBack:( err?: Error| null| undefined , newMail?: boolean, UID?: string ) => void ) {
        this.newSwitchRet = false

        this.doCommandCallback = ( err ) => {
            if ( err ) {
				if ( /exist|not found|unknown folder/i.test ( err.message )) {
					if ( create ) {
						return this.createBox ( true, this.imapServer.listenFolder, CallBack )
					}
				}
                
                return CallBack ( err )
                
            }
            return CallBack ( null, this.newSwitchRet )
        }

        this.commandProcess = ( text: string, cmdArray: string[], next, _callback ) => {
            switch ( cmdArray[0] ) {
                case '*': {
                    if ( /^EXISTS$/i.test ( cmdArray [2])) {
                        if ( parseInt ( cmdArray[1])) {
                            this.newSwitchRet = true
                        }
                    }
                    return _callback ()
                }
                default:
                return _callback ()
            }
        }

        const conText = this.imapServer.condStoreSupport ? ' (CONDSTORE)' : ''
        
        this.Tag = `A${ this.imapServer.TagCount1() }`
        this.cmd = `${ this.Tag } SELECT "${ this.imapServer.listenFolder }"${ conText }`
        this.debug ? debugOut ( this.cmd, false, this.imapServer.listenFolder || this.imapServer.imapSerialID ) : null
        if ( this.writable ) {
            return this.push ( this.cmd + '\r\n')
        }
        
        this.imapServer.destroyAll ( null )
    }

    public _logoutWithoutCheck ( CallBack: ( err?: Error| null ) => void ) {
        //console.trace (`doing _logout typeof CallBack = [${ typeof CallBack }]`)
        if ( !this.isImapUserLoginSuccess ) {
            return CallBack ()
        }

        this.doCommandCallback = ( err?: Error| null , commandLine?: string ) => {

            return CallBack ( err )
        }
		if ( this.idleResponsrTime ) {
			clearTimeout ( this.idleResponsrTime )
		}
        
        this.commandProcess = ( text: string, cmdArray: string[], next, _callback ) => {
            //console.log (`_logout doing this.commandProcess `)
            this.isImapUserLoginSuccess = false
            return _callback ()
        }

        this.Tag = `A${ this.imapServer.TagCount1() }`
        this.cmd = `${ this.Tag } LOGOUT`

        this.debug ? debugOut ( this.cmd, false, this.imapServer.listenFolder || this.imapServer.imapSerialID ) : null
        if ( this.writable ) {
            this.appendWaitResponsrTimeOut = setTimeout (() => {

                return CallBack ()
            }, 1000 * 30 )

            return this.push ( this.cmd + '\r\n')
        }
        if ( CallBack && typeof CallBack === 'function') {
            return CallBack()
        }

    }

    public append ( text: string, subject: string, CallBack: ( err?: Error| null | undefined, info?: string ) => void ) {
        //console.log (`[${ this.imapServer.imapSerialID }] ImapServerSwitchStream append => [${ text.length }]`)
        if ( typeof subject === 'function' ) {
            CallBack = subject
            subject = ''
        }

        this.doCommandCallback = ( err, info ) => {

            if ( err && /TRYCREATE|Mailbox/i.test ( err.message )) {
                return this.createBox ( false, this.imapServer.writeFolder, err1 => {
                    if ( err1 ) {
                        return CallBack ( err1 )
                    }
                    return this.append ( text, subject, CallBack )
                })
            }

            console.log (`[${ this.imapServer.listenFolder || this.imapServer.imapSerialID }] append doCommandCallback `, err )
            return CallBack ( err, info )

        }


        let out = `Date: ${ new Date().toUTCString()}\r\nContent-Type: application/octet-stream\r\nContent-Disposition: attachment\r\nMessage-ID:<${ v4() }@>${ this.imapServer.domainName }\r\n${ subject ? 'Subject: '+ subject + '\r\n' : '' }Content-Transfer-Encoding: base64\r\nMIME-Version: 1.0\r\n\r\n${ text }`

        this.commandProcess = ( text1: string, cmdArray: string[], next, _callback ) => {
            switch ( cmdArray[0] ) {
                case '*':
                case '+': {

                    if ( ! this.imapServer.literalPlus && out.length && ! this.callback ) {
                        console.log (`====> append ! this.imapServer.literalPlus && out.length && ! this.callback = [${ ! this.imapServer.literalPlus && out.length && ! this.callback }]`)
                        this.debug ? debugOut ( out, false, this.imapServer.listenFolder || this.imapServer.imapSerialID ) : null
                        this.callback = true
                        next ( null, out + '\r\n' )
                    }
                    return _callback ()
                }
                default:
                    return _callback ()
            }
        }

        this.Tag = `A${ this.imapServer.TagCount1() }`
        this.cmd = `APPEND "${ this.imapServer.writeFolder }" {${ out.length }${ this.imapServer.literalPlus ? '+' : ''}}`
        this.cmd = `${ this.Tag } ${ this.cmd }`
        const time = out.length + 30000
        this.debug ? debugOut ( this.cmd, false, this.imapServer.listenFolder || this.imapServer.imapSerialID ) : null
        if ( !this.writable ) {
            //console.log (`[${ this.imapServer.imapSerialID }] ImapServerSwitchStream append !this.writable doing imapServer.socket.end ()`)
			if ( typeof this.imapServer?.socket?.end === 'function') {
				return this.imapServer.socket.end ()
			}
            return
        }

        this.push ( this.cmd + '\r\n' )

        this.appendWaitResponsrTimeOut = setTimeout (() => {
            return this.doCommandCallback ( new Error ( `IMAP append TIMEOUT` ))
        }, time )

        //console.log (`*************************************  append time = [${ time }] `)
        if ( this.imapServer.literalPlus ) {
            this.debug ? debugOut ( out, false, this.imapServer.listenFolder || this.imapServer.imapSerialID ) : null
            this.push ( out + '\r\n' )
        }

    }

    public appendStreamV4 ( Base64Data: string = '', subject = '', folderName: string, CallBack: ( err?: Error| null , num?: number ) => void ) {

        if ( !Base64Data ) {
            Base64Data = ''
        }

        console.log (`appendStreamV4 Base64Data = [${ Base64Data }]`)

        this.doCommandCallback = ( err, response ) => {
            //this.debug ? saveLog (`appendStreamV2 doing this.doCommandCallback`) : null
			if ( this.appendWaitResponsrTimeOut ) {
				clearTimeout ( this.appendWaitResponsrTimeOut )
			}
            

            if ( err ) {
                if ( /TRYCREATE/i.test( err.message )) {
                    return this.createBox ( false, this.imapServer.writeFolder, err1 => {
                        if ( err1 ) {
                            return CallBack ( err1 )
                        }
                        this.appendStreamV4 ( Base64Data, subject, folderName, CallBack )
						return 
                    })
                }
                return CallBack ( err )
            }
            let code = response && response.length ? response.split('[')[1]: null
            if ( code ) {

                code = code.split (' ')[2]
                //console.log ( `this.doCommandCallback\n\n code = ${ code } code.length = ${ code.length }\n\n` )
                if ( code ) {
                    return CallBack( null, parseInt ( code ))
                }
            }
            CallBack ()
        }


        const out = `Date: ${ new Date().toUTCString()}\r\nContent-Type: application/octet-stream\r\nContent-Disposition: attachment\r\nMessage-ID:<${ v4() }@>${ this.imapServer.domainName }\r\n${ subject ? 'Subject: '+ subject + '\r\n' : '' }Content-Transfer-Encoding: base64\r\nMIME-Version: 1.0\r\n\r\n`

        this.commandProcess = ( text1: string, cmdArray: string[], next, _callback ) => {
            switch ( cmdArray[0] ) {
                case '*':
                case '+': {
                    if ( ! this.imapServer.literalPlus && out.length && ! this.callback ) {

                        this.callback = true

                        //this.debug ? debugOut ( out, false, this.imapServer.IMapConnect.imapUserName ) : null
                        next ( null, out + Base64Data + '\r\n' )
                    }
                    return _callback ()
                }
                default:
                    return _callback ()
            }
        }

        const _length = out.length + Base64Data.length
        this.Tag = `A${ this.imapServer.TagCount1() }`
        this.cmd = `APPEND "${ folderName }" {${ _length }${ this.imapServer.literalPlus ? '+' : ''}}`
        this.cmd = `${ this.Tag } ${ this.cmd }`
        const _time = _length + 1000 * 60
        this.debug ? debugOut ( this.cmd, false, this.imapServer.listenFolder || this.imapServer.imapSerialID ) : null
        if ( !this.writable ) {
            return this.doCommandCallback ( new Error ('! imap.writable '))
        }

        this.push ( this.cmd + '\r\n' )

        this.appendWaitResponsrTimeOut = setTimeout (() => {

            return this.doCommandCallback( new Error ('appendStreamV4 mail serrver write timeout!'))

        }, _time )

        //console.log (`*************************************  append time = [${ time }] `)
        if ( this.imapServer.literalPlus ) {


            //this.debug ? debugOut ( out + Base64Data + '\r\n', false, this.imapServer.listenFolder || this.imapServer.imapSerialID ) : null
            this.push ( out )
            this.push ( Base64Data + '\r\n' )

        }




    }

    public seachUnseen ( callabck: ( err?: Error| null, newMailIds?: string, havemore?: boolean ) => void ) {
        let newSwitchRet = ''
        let moreNew = false
        this.doCommandCallback = ( err ) => {
            if ( err )
                return callabck ( err )
            return callabck ( null, newSwitchRet, moreNew )
        }
        this.commandProcess = ( text: string, cmdArray: string[], next, _callback ) => {
            switch ( cmdArray[0] ) {
                case '*': {
                    if ( /^SEARCH$/i.test ( cmdArray [1] ) ) {
                        const uu1 = cmdArray[2] && cmdArray[2].length > 0 ? parseInt ( cmdArray[2] ) : 0
                        if ( cmdArray.length > 2 && uu1 ) {
                            if ( ! cmdArray [ cmdArray.length - 1 ].length )
                                cmdArray.pop ()

                            const uu = cmdArray.slice ( 2 ).join ( ',' )
                            if ( /\,/.test ( uu [ uu.length - 1 ]) )
                                uu.substr ( 0, uu.length - 1 )

                            newSwitchRet =  uu
                            moreNew = cmdArray.length > 3
                        }
                        return _callback ()
                    }
                    if ( /^EXISTS$/i.test ( cmdArray [2])) {
                        this.imapServer.emit ('SEARCH_HAVE_EXISTS')
                    }
                    return _callback ()
                }


                default:
                    return _callback ()
            }
        }

        this.Tag = `A${ this.imapServer.TagCount1() }`
        this.cmd = `${ this.Tag } UID SEARCH ALL`
        this.debug ? debugOut ( this.cmd, false, this.imapServer.listenFolder || this.imapServer.imapSerialID ) : null
        if ( this.writable ) {
            return this.push ( this.cmd + '\r\n')
        }

        return this.imapServer.destroyAll ( null )
    }

    public fetch ( fetchNum: string, callback: ( err?: Error| null , newSwitchRet?: boolean ) => void ) {

        this.fetchEmptyBody = this.isFetchBodyFinished = false
        this.doCommandCallback = ( err ) => {
            console.log (`ImapServerSwitchStream doing doCommandCallback this.imapServer.fetching = [${ this.imapServer.fetching }]`)
            if ( this.fetchEmptyBody ) {
                return setTimeout (() => {
                    console.log (`\n\nError have no body! Try again.`)
                    return this.fetch ( fetchNum, callback )
                }, 1000 )
            }
            if ( err ) {
                console.log (`\n\n\nfetch Error\n`, err )
                if ( this.isFetchBodyFinished ) {

                    return callback ( null, this.newSwitchRet )
                }
            }
            return callback ( err, this.newSwitchRet )
        }

        this.newSwitchRet = false

        this.commandProcess = ( text1: string, cmdArray: string[], next, _callback ) => {

            switch ( cmdArray[0] ) {
                case '*': {
                    if ( /^FETCH$/i.test ( cmdArray [ 2 ] )) {

                        if ( /\{\d+\}/.test ( text1 )) {

                            this.imapServer.fetching = parseInt ( text1.split('{')[1].split('}')[0] )
                            /**
                             * 			SUPPORT ZOHO empty Body!
                             */
                            if ( !this.imapServer.fetching ) {
                                console.log (`this.imapServer.fetching body = empty!`)
                                this.fetchEmptyBody = true
                            }
                        }

                        //this.debug ? console.log ( `${ text1 } doing length [${ this.imapServer.fetching }]` ) : null

                    }
                    if ( /^RECENT$/i.test ( cmdArray[2]) && parseInt ( cmdArray[1]) > 0 ) {
                        this.newSwitchRet = true
                    }
                    return _callback ()
                }
                default: {
                    return _callback ()
                }

            }
        }

        //console.log (`ImapServerSwitchStream doing UID FETCH `)
        this.cmd = `UID FETCH ${ fetchNum } ${ this.imapServer.fetchAddCom }`
        this.Tag = `A${ this.imapServer.TagCount1() }`
        this.cmd = `${ this.Tag } ${ this.cmd }`
        this.debug ? debugOut ( this.cmd, false, this.imapServer.listenFolder || this.imapServer.imapSerialID ) : null

        this.appendWaitResponsrTimeOut = setTimeout (() => {
            //this.imapServer.emit ( 'error', new Error (`${ this.cmd } timeout!`))
            return this.doCommandCallback ( new Error (`${ this.cmd } timeout!`))
        }, this.imapServer.fetching + 1000 * 120 )

        if ( this.writable ) {

            return this.push ( this.cmd + '\r\n' )
        }

        return this.imapServer.destroyAll ( null )
    }

    private deleteBox ( CallBack: () => void ) {
        this.doCommandCallback = CallBack
        this.commandProcess = ( text1: string, cmdArray: string[], next, _callback ) => {
            return _callback ()
        }
        this.cmd = `DELETE "${ this.imapServer.listenFolder }"`
        this.Tag = `A${ this.imapServer.TagCount1() }`
        this.cmd = `${ this.Tag } ${ this.cmd }`
        this.debug ? debugOut ( this.cmd, false, this.imapServer.listenFolder || this.imapServer.imapSerialID ) : null
        if ( this.writable )
            return this.push ( this.cmd + '\r\n' )
        return this.imapServer.destroyAll ( null )
    }

    public deleteAMailBox ( boxName: string, CallBack: ( err: Error | null | undefined ) => void ) {

        this.doCommandCallback = err => {

            return CallBack ( err )
        }

        this.commandProcess = ( text1: string, cmdArray: string[], next, _callback ) => {
            return _callback ()
        }
        this.cmd = `DELETE "${ boxName }"`
        this.Tag = `A${ this.imapServer.TagCount1() }`
        this.cmd = `${ this.Tag } ${ this.cmd }`
        this.debug ? debugOut ( this.cmd, false, this.imapServer.listenFolder || this.imapServer.imapSerialID ) : null
        if ( this.writable )
            return this.push ( this.cmd + '\r\n' )
        return this.imapServer.destroyAll ( null )
    }

    public flagsDeleted ( num: string, CallBack: ( err: Error | null | undefined ) => void ) {
        this.doCommandCallback = err => {
            //saveLog ( `ImapServerSwitchStream this.flagsDeleted [${ this.imapServer.listenFolder }] doing flagsDeleted success! typeof CallBack = [${ typeof CallBack }]`)
            
			return CallBack ( err )
        }
        this.commandProcess = ( text1: string, cmdArray: string[], next, _callback ) => {
            switch ( cmdArray[0] ) {
                case '*': {
                    if ( /^FETCH$/i.test ( cmdArray [ 2 ] )) {

                        if ( /\{\d+\}/.test ( text1 )) {

                            this.imapServer.fetching = parseInt ( text1.split('{')[1].split('}')[0] )

                        }

                        this.debug ? console.log ( `${ text1 } doing length [${ this.imapServer.fetching }]` ) : null

                    }
                    if ( /^EXISTS$/i.test ( cmdArray[2]) && parseInt ( cmdArray[1]) > 0 ) {
                        this.newSwitchRet = true
                    }
                    return _callback ()
                }
                default:
                    return _callback ()

            }
        }
        this.cmd = `UID STORE ${ num } FLAGS.SILENT (\\Deleted)`
        this.Tag = `A${ this.imapServer.TagCount1() }`
        this.cmd = `${ this.Tag } ${ this.cmd }`
        this.debug ? debugOut ( this.cmd, false, this.imapServer.listenFolder || this.imapServer.imapSerialID ) : null
        if ( this.writable ) {
            return this.push ( this.cmd + '\r\n' )
        }

        return this.imapServer.destroyAll ( null )
    }

    public expunge ( CallBack: (err: Error | null | undefined, newSwitchRet: boolean ) => void ) {


        this.doCommandCallback = err => {

            return CallBack ( err, this.newSwitchRet )
        }

        this.commandProcess = ( text: string, cmdArray: string[], next , _callback ) => {
            switch ( cmdArray[0] ) {
                case '*': {

                    if ( /^RECENT$|^EXPUNGE$|^EXISTS$/i.test ( cmdArray[2]) && parseInt (cmdArray[1]) > 0 ) {
                        //console.log (`\n\nexpunge this.newSwitchRet = true\n\n`)
                        this.newSwitchRet = true
                    }
                    return _callback ()
                }
                default: {
                    return _callback ()
                }
                    
            }
        }

        this.Tag = `A${ this.imapServer.TagCount1() }`
        this.cmd = `${ this.Tag } EXPUNGE`
        this.debug ? debugOut ( this.cmd, false, this.imapServer.listenFolder || this.imapServer.imapSerialID ) : null
        if ( this.writable ) {
            return this.push ( this.cmd + '\r\n')
        }

        return this.imapServer.destroyAll ( null )
    }

    public listAllMailBox ( CallBack: ( err?: Error| null, list?: string [] ) => void) {
        let boxes: string [] = []
        this.doCommandCallback = ( err ) => {
            if ( err )
                return CallBack ( err )
            return CallBack ( null, boxes )
        }
        this.commandProcess = ( text: string, cmdArray: string[], next, _callback ) => {
            switch ( cmdArray[0] ) {
                case '*': {
                    debug ? saveLog ( `IMAP listAllMailBox this.commandProcess text = [${ text }]` ) : null
                    if ( /^LIST/i.test ( cmdArray [1] ) ) {
                        boxes.push ( cmdArray[2] + ',' + cmdArray[4] )
                    }
                    return _callback ()
                }
                default:
                    return _callback ()
            }
        }

        this.Tag = `A${ this.imapServer.TagCount1() }`
        this.cmd = `${ this.Tag } LIST "" "*"`
        this.debug ? debugOut ( this.cmd, false, this.imapServer.listenFolder || this.imapServer.imapSerialID ) : null
        if ( this.writable )
            return this.push ( this.cmd + '\r\n')
        return this.imapServer.destroyAll ( null )
    }
}

const connectTimeOut = 10 * 1000

export class qtGateImap extends EventEmitter {
    public socket: TLSSocket| null = null
    public imapStream: ImapServerSwitchStream | null = null
    public newSwitchRet = null
    public newSwitchError = null
    public fetching = 0
    private tagcount = 0
    public domainName = ''
    public serverSupportTag = ''
    public idleSupport = false
    public condStoreSupport = false
    public literalPlus = false
    public fetchAddCom = ''
    public imapEnd = false
    public imapSerialID = ''


    private port = 0

    public TagCount1 () {
        if ( ++ this.tagcount < MAX_INT ) {
            return this.tagcount
        }
            
        return this.tagcount = 0
    }

    private connectTimeOut: any

    private connect () {
        

        const _connect = () => {

            clearTimeout ( timeout )
            console.log ( inspect ( this.socket, false, 2, true ))

            if ( this.socket = conn ) {
				this.socket.setKeepAlive ( true )
				if ( this.imapStream ) {
					this.socket.pipe ( this.imapStream ).pipe ( this.socket ).once ( 'error', err => {
						return this.destroyAll ( err )
					}).once ( 'end', () => {
						return this.destroyAll ( null )
					})
				}
				
			}
			
            
        }

        //console.log ( `qtGateImap connect mail server [${ this.IMapConnect.imapServer }: ${ this.port }] setTimeout [${ connectTimeOut /1000 }] !`)

        const timeout = setTimeout (() => {
            return this.destroyAll ( new Error ('connect time out!'))
        }, connectTimeOut )


		let conn: TLSSocket| null = null
        try {
            conn = connect ({ host: this.IMapConnect.imapServer, servername: this.IMapConnect.imapServer, port: this.port }, _connect )
        } catch ( ex ) {
            console.log ( ex )
            this.connect ()
			return
        }

        return conn.once ( 'error', err => {
            return this.destroyAll ( err )
        })


    }

    constructor ( public IMapConnect: imapConnect, public listenFolder = '', public deleteBoxWhenEnd: boolean, public writeFolder: string, private debug: boolean, public newMail: ( mail: Buffer ) => void| null, public skipOldMail = false, public exit_when_idle = false ) {
        super ()
        this.domainName = IMapConnect.imapUserName.split ('@')[1]
        this.imapSerialID = createHash ( 'md5' ).update ( JSON.stringify( IMapConnect) ).digest ('hex').toUpperCase()
        this.port = typeof this.IMapConnect.imapPortNumber === 'object' ? this.IMapConnect.imapPortNumber[0]: this.IMapConnect.imapPortNumber

        this.imapStream = new ImapServerSwitchStream ( this, this.deleteBoxWhenEnd, this.debug )
        this.connect ()
        this.once ( `error`, err => {
            debug ? saveLog ( `[${ this.imapSerialID }] this.on error ${ err && err.message ? err.message : null }`) : null
            this.imapEnd = true
            return this.destroyAll ( err )

        })


    }

    public destroyAll ( err: Error| null = null ) {
        //console.trace (`class qtGateImap on destroyAll`, err )
        this.imapEnd = true

        if ( this.socket && typeof this.socket.end === 'function' ) {
            this.socket.end ()
        }

        return this.emit ( 'end', err )

    }

    public logout ( CallBack?: () => void ) {
        console.log (`IMAP logout`)
        const _end = () => {
            if ( typeof CallBack === 'function' ) {
                return CallBack ()
            }
        }

        if ( this.imapEnd ) {
            console.log (`this.imapEnd`)
            return _end ()
        }
        this.imapEnd = true
        console.log (`this.imapStream.loginoutWithCheck`)
		if ( typeof this.imapStream?.loginoutWithCheck === 'function' ) {
			return this.imapStream.loginoutWithCheck (() => {

				if ( this.socket && typeof this.socket.end === 'function' ) {
	
					this.socket.end()
				} else {
					console.log (`this.socket have not end function!`)
				}
	
				this.emit ( 'end' )
				return _end ()
			})
		}
        
    }

}

export const getImapSmtpHost = function ( _email: string ) {
	const email = _email.toLowerCase()
	const yahoo = function ( _domain: string[] ) {
		const domain = _domain[1]
		if ( /yahoo.co.jp$/i.test ( domain ))
			return 'yahoo.co.jp';
			
		if ( /((.*\.){0,1}yahoo|yahoogroups|yahooxtra|yahoogruppi|yahoogrupper)(\..{2,3}){1,2}$/.test ( domain )) {
			return 'yahoo.com'
		}
			
		
		if ( /(^hotmail|^outlook|^live|^msn)(\..{2,3}){1,2}$/.test ( domain )) {
			return 'hotmail.com'
		}
			
			
		if ( /^(me|^icould|^mac)\.com/.test ( domain )) {
			return 'me.com'
		}

		if ( /kloak\.io/.test ( domain )) {
			if ( /zoho/.test (_domain[0])) {
				return 'zoho.com'
			}
			return 'mail.yahoo.com'
		}

		if ( /kloak\.app/.test ( domain )) {
			return 'outlook.office365.com'
		}

		if ( /conettech\.ca/.test ( domain ) ) {
			return 'ionos.com'
		}

		if (/kloak-io\.awsapps\.com/.test (domain)) {
			return 'mail.us-east-1.awsapps.com'
		}

		
			
		return domain
	}

	const emailSplit = email.split ( '@' )
	
	if ( emailSplit.length !== 2 ) {
		return null
	}
		
		
	const domain = yahoo ( emailSplit )
	
	const ret = {
		imap: 'imap.' + domain,
		smtp: 'smtp.' + domain,
		SmtpPort: [465,587,994],
		ImapPort: 993,
		imapSsl: true,
		smtpSsl: true,
		haveAppPassword: false,
		ApplicationPasswordInformationUrl: ['']
	}
	
	switch ( domain ) {
		//		yahoo domain have two different 
		//		the yahoo.co.jp is different other yahoo.*
		case 'yahoo.co.jp': {
			ret.imap = 'imap.mail.yahoo.co.jp'
			ret.smtp = 'smtp.mail.yahoo.co.jp'
			break
		}
		

		//			gmail
		case 'google.com':
		case 'googlemail.com':
		case 'gmail': {
			ret.haveAppPassword = true;
			ret.ApplicationPasswordInformationUrl = [
				'https://support.google.com/accounts/answer/185833?hl=zh-Hans',
				'https://support.google.com/accounts/answer/185833?hl=ja',
				'https://support.google.com/accounts/answer/185833?hl=en'
			]
			break
		}
		

        case 'gandi.net': {
			ret.imap = ret.smtp = 'mail.gandi.net'
        	break
		}
            
		
		//				yahoo.com
		case 'rocketmail.com':
		case 'y7mail.com':
		case 'ymail.com':
		case 'yahoo.com': {
			ret.imap = 'imap.mail.yahoo.com'
			ret.smtp = (/^bizmail.yahoo.com$/.test(emailSplit[1]))
				? 'smtp.bizmail.yahoo.com'
				: 'smtp.mail.yahoo.com'
			ret.haveAppPassword = true;
			ret.ApplicationPasswordInformationUrl = [
				'https://help.yahoo.com/kb/SLN15241.html',
				'https://help.yahoo.com/kb/SLN15241.html',
				'https://help.yahoo.com/kb/SLN15241.html'
			]
			break
		}
		

        case 'mail.ee': {
			ret.smtp = 'mail.ee'
            ret.imap = 'mail.inbox.ee'
        	break
		}
            

		
        //		gmx.com
        case 'gmx.co.uk':
        case 'gmx.de':
		case 'gmx.us':
		case 'gmx.com' : {
            ret.smtp = 'mail.gmx.com'
			ret.imap = 'imap.gmx.com'
			break
        }
		
		//		aim.com
		case 'aim.com': {
			ret.imap = 'imap.aol.com'
			break
		}
		
		
		//	outlook.com
		case 'windowslive.com':
		case 'hotmail.com': 
		case 'outlook.com': {
			ret.imap = 'imap-mail.outlook.com'
			ret.smtp = 'smtp-mail.outlook.com'
			break
		}
		
		
		//			apple mail
        case 'icloud.com':
        case 'mac.com':
		case 'me.com': {
			ret.imap = 'imap.mail.me.com'
			ret.smtp = 'smtp.mail.me.com'
			break
		}
		
		
		//			163.com
		case '126.com':
		case '163.com': {
			ret.imap = 'appleimap.' + domain
			ret.smtp = 'applesmtp.' + domain
			break
		}
		
		
		case 'sina.com':
		case 'yeah.net': {
			ret.smtpSsl = false
			break
		}

		case 'outlook.office365.com': {
			ret.imap = 'outlook.office365.com'
			break
		}

		case 'getseguro.io': {
			ret.imap = 'mail.privateemail.com'
			break
		}

		case 'zoho.com': {
			ret.imap = 'imappro.zoho.com'
		}
		
		
	}
	
	return ret
	
}


export class qtGateImapRead extends qtGateImap {

    private openBox = false

    constructor ( IMapConnect: imapConnect, listenFolder: string, deleteBoxWhenEnd: boolean, newMail: ( mail: Buffer ) => void, skipOldMail = false ) {

        super ( IMapConnect, listenFolder, deleteBoxWhenEnd, '', debug, newMail, skipOldMail )
        this.once ( 'ready', () => {
            this.openBox = true
        })
    }

}

export const getMailAttached = ( email: Buffer ) => {

    const attachmentStart = email.indexOf ('\r\n\r\n')
    if ( attachmentStart < 0 ) {
        console.log ( `getMailAttached error! can't faind mail attahced start!\n${ email.toString() }`)
        return ''
    }
    const attachment = email.slice ( attachmentStart + 4 )

    return attachment.toString()
}

export const getMailSubject = ( email: Buffer ) => {
    const ret = email.toString().split ('\r\n\r\n')[0].split('\r\n')

    const yy = ret.find ( n => {
        return /^subject\: /i.test( n )
    })
    if ( !yy || !yy.length ) {
        debug ? saveLog(`\n\n${ ret } \n`) : null
        return ''
    }
    return yy.split(/^subject\: +/i)[1]
}

export const getMailAttachedBase64 = ( email: Buffer ) => {

    const attachmentStart = email.indexOf ('\r\n\r\n')
    if ( attachmentStart < 0 ) {
        console.log ( `getMailAttached error! can't faind mail attahced start!`)
        return null
    }
    const attachment = email.slice ( attachmentStart + 4 )
    return attachment.toString()
}


export const imapAccountTest = ( IMapConnect: imapConnect, CallBack: (  err?: Error, ret?: () => void ) => void ) => {
    debug ? saveLog ( `start test imap [${ IMapConnect.imapUserName }]`, true ) : null
    let callbackCall = false
    let startTime = null

    const listenFolder = v4 ()
    const ramdomText = randomBytes ( 20 )
    let timeout: NodeJS.Timer

    const doCallBack = ( err?: Error, ret?: () => void ) => {
        if ( ! callbackCall ) {

            saveLog (`imapAccountTest doing callback err [${ err && err.message ? err.message : `undefine `}] ret [${ ret ? ret : 'undefine'}]`)
            callbackCall = true
            clearTimeout ( timeout )
            return CallBack ( err, ret )
        }
    }


    let rImap = new qtGateImapRead ( IMapConnect, listenFolder, debug, mail => {
        rImap.logout ()
    })
    rImap.once ( 'ready', () => {
        rImap.logout ()

    })

    rImap.once ( 'end', err => {
        console.log (`imapAccountTest on end err = `, err )
        doCallBack ( err )
    })

    rImap.once ( 'error', err => {
        debug ? saveLog ( `rImap.once ( 'error' ) [${ err.message }]`, true ): null
        return doCallBack ( err )
    })


}

export const imapGetMediaFile = ( IMapConnect: imapConnect, fileName: string, CallBack: ( err: null,retText: string|null ) => void ) => {
    let rImap = new qtGateImapRead ( IMapConnect, fileName, debug, mail => {
        rImap.logout ()
        const retText = getMailAttachedBase64 ( mail )
        return CallBack ( null, retText )
    })
}
export const seneMessageToFolder = ( IMapConnect: imapConnect, writeFolder: string, message: string, subject: string, createFolder: boolean, CallBack: (err: any) => void) => {
	const wImap = new qtGateImap ( IMapConnect, '', false, writeFolder, debug, () => {} )
	let _callback = false 
	//console.log ( `seneMessageToFolder !!! ${ subject }`)
	wImap.once ( 'error', err => {
		logger (inspect (`wImap.once ( 'error')`, false, 3, true ), err )
		wImap.destroyAll ( err )
		if ( !_callback ) {
			CallBack ( err )
			return _callback = true 
		}
	})

	wImap.once ( 'ready', () => {
		return series ([
			next => {
                if ( !createFolder ) {
                    return next ()
                }
                return wImap.imapStream?.createBox ( false, writeFolder, next )
            },
			next => wImap.imapStream?.appendStreamV4( message, subject, writeFolder, next ),
			next => wImap.imapStream?._logoutWithoutCheck ( next )
		], err => {
			logger (inspect (`seneMessageToFolder series error!`, false, 3, true ), err )
			_callback = true
			if ( err ) {
				wImap.destroyAll ( err )
			}
			return CallBack ( err )
		})
	})

	wImap.once ('end', err => {
		if (err) {
			logger (`seneMessageToFolder on end had ERROR try again`, err )
			return seneMessageToFolder (IMapConnect, writeFolder, message, subject, createFolder, CallBack)
		}
		logger (`seneMessageToFolder on end have no ERROR!`)
	})
	return 
}
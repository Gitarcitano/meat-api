import {ModelRouter} from '../common/model-router'
import * as restify from 'restify'
import { NotFoundError } from "restify-errors"
import {User} from './users.model'

class UsersRouter extends ModelRouter<User> {

    constructor(){
        super(User)
        this.on('beforeRender', document=>{
            document.password = undefined
            //delete document.password
        })
    }

    findByEmail = (req, res, next)=>{
        if(req.query.email){
            User.find({email: req.query.email})
                .then(this.renderAll(res, next))
                .catch(next)
        }else{
            next()
        }
    }

    applyRoutes(application: restify.Server){

        application.get('/users', restify.plugins.conditionalHandler([
            { version: '1.0.0', handler: this.findAll},
            { version: '2.0.0', handler: [this.findByEmail, this.findAll]}
        ]))        

        application.get('/users/:id',[this.validateId,this.findByID])
        application.post('/users', this.save)
        application.put('/users/:id', [this.validateId,this.replace])
        application.patch('/users/:id', [this.validateId,this.update])
        application.del('/users/:id', [this.validateId,this.delete])

    }
}

export const usersRouter = new UsersRouter()
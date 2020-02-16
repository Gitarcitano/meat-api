import * as restify from 'restify'
import * as mongoose from 'mongoose'
import {ModelRouter} from '../common/model-router'
import { Review } from './reviews.model'

class ReviewsRouter extends ModelRouter<Review> {
    constructor(){
        super(Review)
    }

    protected prepareOne(query: mongoose.DocumentQuery<Review,Review>):  mongoose.DocumentQuery<Review,Review>{
        return query.populate('user', 'name')
                    .populate('restaurant', 'name')
    }

    /*findByID =  (req, res, next)=>{
        this.model.findById(req.params.id)
            .populate('user', 'name')
            .populate('restaurant', 'name')
            .then(this.render(res, next))
            .catch(next)
    }*/

    applyRoutes(application: restify.Server){
        application.get(`${this.basePath}`, this.findAll)
        application.get(`${this.basePath}/:id`,[this.validateId,this.findByID])        
        application.post(`${this.basePath}`, this.save)        
    }
}

export const reviewsRouter = new ReviewsRouter()
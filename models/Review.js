const mongoose = require('mongoose')

const ReviewSchema = new mongoose.Schema({
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: [true, 'Please provide rating']
    },
    title: {
        type: String,
        trim: true,
        maxLength: 100,
        required: [true, 'Please provide review title']
    },
    comment: {
        type: String,
        required: [true, 'Please provide review text']
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    product: {
        type: mongoose.Schema.ObjectId,
        ref: 'Product',
        require: true
    }
}, {timestamps: true});

// allow user can leave only one review per product
ReviewSchema.index(
    { product: 1, user: 1 },
    { unique: true }
);

ReviewSchema.statics.calculateAverageRating = async function(productId){
    // console.log(productId)
    const result = await this.aggregate([
        { $match: { product: productId } },
        {
            $group: {
                _id: null,
                averageRating: { $avg: '$rating' },
                numOfReviews: { $sum: 1 },
            }
        }
    ]);
    console.log(result);

    try{
        await this.model('Product').findOneAndUpdate(
            { _id: productId },
            {
                averageRating: Math.ceil(result[0]?.averageRating || 0),
                numOfReviews: result[0]?.numOfReviews || 0
            }
        )
    }catch(error){
        console.log(error)
    }
}

ReviewSchema.post('save', async function() {
    await this.constructor.calculateAverageRating(this.product);
    // console.log('post save hook called')
});

ReviewSchema.post('deleteOne', { document: true }, async function() {
    await this.constructor.calculateAverageRating(this.product);
    // console.log('post remove hook called')
});

module.exports = mongoose.model('Review', ReviewSchema);
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

    //to store refreshtoken in databse
const refreshSchema = new Schema(
    {
        token: { type: String, required: true},
        userId: { type:Schema.Types.ObjectId, ref: 'User' },
        activated: { type: Boolean, required: false, default: false}
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Refresh', refreshSchema, 'tokens');
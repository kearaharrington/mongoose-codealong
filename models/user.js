const mongoose = require('mongoose');

// // create a schema
// const userSchema = new mongoose.Schema({
//     name: String,
//     email: { type: String, required: true, unique: true },
//     meta: {
//         age: Number,
//         website: String
//     }
// }, {
//     timestamps: true
// });

// userSchema.methods.sayHello = function() {
//     return "Hi " + this.name;
//   };

// const User = mongoose.model('User', userSchema);

// // make this available to our other files
// module.exports = User;

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        default: 'No name provided'
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    meta: {
        age: Number,
        website: String
    }
}, {
    timestamps: true
});

// below function will not work if you try to use an arrow function. it interrupts the reference (lexical scope with arrow function)
userSchema.methods.sayHello = function() {
    return `Hello, my name is ${this.name}`;
}

module.exports = mongoose.model('User', userSchema)
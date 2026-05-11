const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    recordedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    cardNumber: { type: Number, required: true },
    amountExpected: { type: Number, required: true },
    amountPaid: { type: Number, required: true, default: 0 },
    outstandingAmount: { type: Number, default: 0 },
    status: { type: String, enum: ['paid', 'part-payment', 'owing'], required: true },
    notes: { type: String, default: null },
    method: { type: String, enum: ['cash', 'card', 'transfer'], required: true },
    date: { type: Date, default: Date.now }
});

paymentSchema.pre('save', function (next) {
    this.outstandingAmount = this.amountExpected - this.amountPaid;
    if (this.amountPaid === 0) this.status = 'owing';
    else if (this.amountPaid >= this.amountExpected) { this.status = 'paid'; this.outstandingAmount = 0; }
    else this.status = 'part-payment';
    next();
});

module.exports = mongoose.model('Payment', paymentSchema);

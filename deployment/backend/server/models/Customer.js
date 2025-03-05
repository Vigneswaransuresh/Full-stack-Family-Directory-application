import mongoose from 'mongoose';

const familyMemberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  relationship: { type: String, required: true },
  dateOfBirth: String,
  birthTime: String,
  birthPlace: String,
  mobileNumber: String
});

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sex: { type: String, required: true },
  dateOfBirth: { type: String, required: true },
  birthTime: { type: String, required: true },
  birthPlace: { type: String, required: true },
  profession: { type: String, required: true },
  city: { type: String, required: true },
  lastVisitDate: { type: String, required: true },
  familyMembers: [familyMemberSchema]
}, {
  timestamps: true
});

export default mongoose.model('Customer', customerSchema);
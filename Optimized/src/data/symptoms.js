import {
  FaTemperatureHigh,
  FaEye,
  FaBone,
  FaHeart,
  FaBaby,
  FaTooth,
  FaQuestionCircle,
  FaAllergies
} from "react-icons/fa";

import { MdPregnantWoman } from "react-icons/md";

const symptoms = [
  {
    id: 1,
    title: "Fever / Cold",
    description: "Fever, cough, flu",
    specialty: "General Physician",
    icon: FaTemperatureHigh,
    color: "#3B82F6"
  },
  {
    id: 2,
    title: "Eye Problem",
    description: "Vision issues, eye pain",
    specialty: "Ophthalmologist",
    icon: FaEye,
    color: "#6366F1"
  },
  {
    id: 3,
    title: "Bone & Joint Pain",
    description: "Back pain, knee pain",
    specialty: "Orthopedic",
    icon: FaBone,
    color: "#8B5CF6"
  },
  {
    id: 4,
    title: "Heart / Chest Problem",
    description: "Chest discomfort, palpitations",
    specialty: "Cardiologist",
    icon: FaHeart,
    color: "#EF4444"
  },
  {
    id: 5,
    title: "Skin Problem",
    description: "Rashes, allergies, acne",
    specialty: "Dermatologist",
    icon: FaAllergies,
    color: "#10B981"
  },
  {
    id: 6,
    title: "Women's Health",
    description: "Pregnancy, gynecology",
    specialty: "Gynecologist",
    icon: MdPregnantWoman,
    color: "#F472B6"
  },
  {
    id: 7,
    title: "Child Health",
    description: "Pediatric care",
    specialty: "Pediatrician",
    icon: FaBaby,
    color: "#06B6D4"
  },
  {
    id: 8,
    title: "Dental Problem",
    description: "Tooth pain, gum issues",
    specialty: "Dentist",
    icon: FaTooth,
    color: "#F59E0B"
  },
  {
    id: 9,
    title: "Not Sure",
    description: "Help me choose",
    specialty: "General Physician",
    icon: FaQuestionCircle,
    color: "#6B7280"
  }
];

export default symptoms;
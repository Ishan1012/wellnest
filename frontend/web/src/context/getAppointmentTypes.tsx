import { Calendar, Stethoscope, User } from "lucide-react";

export const allAppointmentTypes = [
    { icon: <Stethoscope size={32} />, title: "New Consultation", description: "For new patients or new health concerns." },
    { icon: <Calendar size={32} />, title: "Follow-up Visit", description: "For existing patients continuing their treatment." },
    { icon: <User size={32} />, title: "Annual Check-up", description: "A routine yearly health examination." },
];
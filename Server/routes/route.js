import express from 'express';
import { changePassword, requestPasswordResetLink, userLogin, userRegister } from '../controller/auth.controller';
import { addAppointment, cancelAppointment, completeAppointment, listAppointment, rescheduleAppointment, startAppointment } from '../controller/appointment.controller';
export const authRoute = express.Router();
authRoute.post('/register-user',userRegister)
authRoute.post('/login', userLogin)
authRoute.post('/request_password_reset',requestPasswordResetLink);
authRoute.post('/change_password',changePassword)

export const appointmentRoute = express.Router();
appointmentRoute.post('/appointment/add-appointment',addAppointment);
appointmentRoute.get('/appointment/get-appointments', listAppointment);
appointmentRoute.post('/appointment/cancel/:appointment_id',cancelAppointment);
appointmentRoute.post('/appointment/in_progress/:appointment_id',startAppointment);
appointmentRoute.post('/appointment/reschedule/:appointment_id',rescheduleAppointment);
appointmentRoute.post('/appointment/complete/:appointment_id', completeAppointment)



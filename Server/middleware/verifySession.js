import jwt from "jsonwebtoken";
export const verifySession = ( req, res, next)=>{
  const token = req.cookies[HealthCare_session]
  if(!token){
    return res.status(401).json({
      success:false,
      message: 'No session token provided '
    })
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.userId = decoded.userId
    next()
  } catch (error) {
    console.log(error.message)
    return res.status(401).json({
      success:false,
      message:'Invalid or expired session'
    })
  }
}
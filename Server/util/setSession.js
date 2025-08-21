import jwt from 'jsonwebtoken'
export const setSession = (res, userId)=>{
  if(!process.env.JWT_SECRET){
    throw new Error('JWT key not provided')
  }
  const token = jwt.sign(
    {userId},
    process.env.JWT_SECRET,
    {expiresIn: '2d'}
  )
  const cookieName = HealthCare_session;
  res.cookie(
    cookieName,
    token,
    {
      httpOnly:true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV ? 'none' :'strick',
      maxAge: 2 * 24 * 60 * 60* 1000
    }
  )
  return token
}
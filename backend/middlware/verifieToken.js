import jwt from 'jsonwebtoken';

export const verifyToken = (req , res , next) => {
    const token = req.cookies.token;
if (!token) return res.status(401).json({succes:false , message:"unauthorized no token provided"})
    
    try {
        const decoded = jwt.verify(token , process.env.JWT_SECRET)
        if (!decoded) return res.status(401).json({succes:false , message:"unauthorized invalid token "})
    
        req.userId = decoded.userId
        next()
    } catch (error) {
        return res.status(401).json({ succes: false, message: "Token verification failed" });
      }
      
    
}

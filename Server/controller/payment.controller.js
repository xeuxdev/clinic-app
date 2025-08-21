export const initiatePayment = async(req, req)=>{
    const { email, amount } = req.body;
    if( !email || !amount){
      return res.status(400).json({
        success:false,
        message:'required details not provided'
      })
    }
  try {
    // amount in kobo (₦100 = 10000)
    const response = await paystack.post("/transaction/initialize", {
      email,
      amount: amount * 100,
    });

    res.status(200).json({
      success: true,
      message: "Payment initialized",
      data: response.data.data, // contains authorization_url, access_code, reference
    });
  } catch (error) {
    console.error("Paystack init error:", error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: "Payment initialization failed",
    });
  }
}
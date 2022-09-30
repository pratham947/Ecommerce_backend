export const Storetoken = (user, token, statuscode, res) => {
    // setting a cookie in localstorage 
    return res.status(statuscode).cookie("token",token).json({
        success: true,
        message: "you are looged in sucessfully",
        user,
        token
    })
}

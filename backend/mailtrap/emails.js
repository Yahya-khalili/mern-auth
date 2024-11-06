import { PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplates.js"
import { mailtrapclient, sender } from "./mailtrap.config.js"

export const sendVerificationEmail = async (email , verificationtoken) => {
const recipient = [{email}]
try {
    const response = await mailtrapclient.send({
        from:sender,
        to:recipient,
        subject:"verify your email",
        html:VERIFICATION_EMAIL_TEMPLATE.replace('{verificationCode}' , verificationtoken),
        category:"email verification"
    })
    console.log("email sent successufully" , response)
} catch (error) {
    console.log(`error sending verification email :${error}`)
    throw new Error(`error sending verification email :${error}`)
}

}


export const sendWelcomEmail = async (email , name) => {
    const recipient = [{email}];
    try {
       const  response = await mailtrapclient.send({
            from:sender,
            to:recipient,
            template_uuid: "3ba5b838-7311-4005-bf49-f765ce8f700a",
    template_variables: {
      "company_info_name": "YAHYA'S COMPANY",
      "name": name,
    }
        })

        console.log("welcom email sent successfuly" , response)
        } catch (error) {
           throw new Error("error sending email")
    }

}

export const sendPasswordResetEmail = async (email, resetURL) => {
	const recipient = [{ email }];

	try {
		const response = await mailtrapclient.send({
			from: sender,
			to: recipient,
			subject: "Reset your password",
			html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
			category: "Password Reset",
		});
	} catch (error) {
		console.error(`Error sending password reset email`, error);

		throw new Error(`Error sending password reset email: ${error}`);
	}
};

export const sendResetSuccesEmil = async (email) => {
    const recipient = [{email}];
try {
         const  response = await mailtrapclient.send({
            from:sender,
            to:recipient,
            subject:"pssword reset successfuly",
            html:PASSWORD_RESET_SUCCESS_TEMPLATE,
             category:"password reset successfuly"
        })
} catch (error) {
    console.log(`error sending psword reset :${error}`)
    throw new Error(`error sending reset email :${error}`)
}

}
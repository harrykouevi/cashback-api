Object.prototype.verifyLoginResponse = (err, res) => {
    console.log(res);
    if(err){ 
        pm.test("API route is accessible", function () {
            // pm.expect(res).to.be.oneOf([200, 201]);
            if(err){ 
            pm.expect.fail("Request failed with error: " + err);
            }
        });
    }else{

        pm.test("API route is accessible", function () {
            // pm.expect(res).to.be.oneOf([200, 201]);
            // if(err){ 
            // pm.expect.fail("Rout not found . ErreurCode : " + res.code);
            // }
            console.log('++++++',pm.response.to.have.status(200)) ;
            pm.expect(res).to.have.property('code', 404);

        });

        // Check if the response status code is 200
        pm.test("login is successful", function () {
            // pm.expect(res).to.have.property('code', 200);
            pm.expect(res.code).to.be.oneOf([200, 201]);
            // Check for status code 200
        });
        
        var loginResponse = res.json();
        pm.test("find token", function () {
            pm.expect(loginResponse).to.have.property('token');
            // Verify token is present in login response
            console.log("Login Token:", loginResponse.token); // Log the login token
            pm.environment.set("bearer_token", loginResponse.token); // Store login token in environment variable
        });
    
    }
};
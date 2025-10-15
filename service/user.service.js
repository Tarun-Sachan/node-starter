const UserService = {
    Login: async (data) => {
        const { email, password } = data;

        if (email !== "user@gmail.com" || password !== "12345") {
            throw new Error("User not found"); // pass a string, not an object
        }

        return {
            token: "thisisyoursecuretoken",
        };
    },
};

export default UserService;

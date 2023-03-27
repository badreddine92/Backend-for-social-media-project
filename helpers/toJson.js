exports.userToJson = (token, id, username, email, is_chef) => {
    return {
      token,
      user: {
        id,
        username,
        email,
        is_chef,
      },
    };
  }


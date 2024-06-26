import { Connection, Request, TYPES } from "tedious";

export const saveNewUser = (connection: Connection, data: any) => {
  const query = `INSERT INTO Users(fullName, email, phoneNumber, password)
                        VALUES (@FullName, @Email, @PhoneNumber, @Password)`;

  const request = new Request(query, (err) => {
    if (err) {
      console.log("request error =>", err);
    }
  });

  request.addParameter("fullName", TYPES.NVarChar, data.fullName);
  request.addParameter("phoneNumber", TYPES.NVarChar, data.phoneNumber);
  request.addParameter("email", TYPES.NVarChar, data.email);
  request.addParameter("password", TYPES.NVarChar, data.password);

  connection.execSql(request);
};

export const getAllUsers = (connection: Connection): Promise<any> => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM Users`;
    const request = new Request(query, (err, rowCount) => {
      if (err) {
        return reject(err);
      } else if (rowCount === 0) {
        return resolve(null);
      }
    });
    const users: any[] = [];
    request.on("row", (columns) => {
      const rowdata: any = {};
      columns.forEach((column: any) => {
        rowdata[column.metadata.colName] = column.value;
      });

      users.push(rowdata);
    });
    request.on("requestCompleted", () => {
      resolve(users);
    });
    connection.execSql(request);
  });
};

export const checkIfUserExists = (
  connection: Connection,
  email: string
): Promise<any> => {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM Users WHERE email = @Email";
    const request = new Request(query, (err, rowCount: any) => {
      if (err) {
        return reject(err);
      }
      if (rowCount > 0) {
        return resolve(null);
      } else {
        return resolve(1);
      }
    });
    request.addParameter("Email", TYPES.NVarChar, email);
    connection.execSql(request);
  });
};

export const getSingleUser = (
  connection: Connection,
  data: any
): Promise<any> => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM Users WHERE email = @Email`;

    const request = new Request(query, (err, rowCount) => {
      if (err) {
        console.log({ err });
        reject(err);
      } else if (rowCount === 0) {
        return resolve(null);
      }
    });
    let user: Record<string, string | number> = {};
    request.on("row", (columns) => {
      columns.forEach(
        (column: any) => (user[column.metadata.colName] = column.value)
      );
    });
    request.on("requestCompleted", () => {
      resolve(user);
    });
    request.on("done", (rowCount) => {
      console.log("done", rowCount);
    });

    request.addParameter("Email", TYPES.NVarChar, data);
    connection.execSql(request);
  });
};
export const getUserById = (connection: Connection, _id: any): Promise<any> => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM Users WHERE id = @ID`;
    const request = new Request(query, (err, rowCount) => {
      if (err) {
        return reject(err);
      } else if (rowCount === 0) {
        return resolve(null);
      }
    });
    const user: any[] = [];
    request.on("row", (columns) => {
      const rowdata: any = {};
      columns.forEach((column: any) => {
        rowdata[column.metadata.colName] = column.value;
      });

      user.push(rowdata);
    });
    request.on("requestCompleted", () => {
      resolve(user);
    });
    request.addParameter("ID", TYPES.Int, _id);
    connection.execSql(request);
  });
};

export const deleteUser = (connection: Connection, data: any) => {
  const query = `DELETE FROM Users WHERE id = ${data.id}`;

  const request = new Request(query, (err, rowCount) => {
    if (err) {
      console.log("Failed to delete user =>", err);
    } else if (rowCount === 0) {
      console.log("User not found");
    } else {
      console.log("User deleted successfully");
    }
    connection.close();
  });
  connection.execSql(request);
};

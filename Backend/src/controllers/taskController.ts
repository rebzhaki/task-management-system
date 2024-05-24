import { resolve } from "path";
import { Connection, Request, TYPES } from "tedious";

export const saveNewTask = (connection: Connection, data: any) => {
  const query = `INSERT INTO Tasks(task_name, task_priority, due_date, task_description, tracking_number, task_assigner_id)
                        VALUES (@TaskName, @TaskPriority, @DueDate, @TaskDescription, @TrackingNumber, @TaskAssignerId)`;

  const request = new Request(query, (err) => {
    if (err) {
      console.log("request error =>", err);
    }
    connection.close();
  });

  request.addParameter("TaskName", TYPES.NVarChar, data.task_name);
  request.addParameter("TaskPriority", TYPES.NVarChar, data.task_priority);
  request.addParameter("DueDate", TYPES.NVarChar, data.due_date);
  request.addParameter(
    "TaskDescription",
    TYPES.NVarChar,
    data.task_description
  );
  request.addParameter("TrackingNumber", TYPES.NVarChar, data.tracking_number);
  request.addParameter("TaskAssignerId", TYPES.NVarChar, data.task_assigner_id);

  connection.execSql(request);
};

export const getTaskById = (connection: Connection, _id: any): Promise<any> => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM Tasks WHERE id = @ID`;
    const request = new Request(query, (err, rowCount) => {
      if (err) {
        return reject(err);
      } else if (rowCount === 0) {
        return resolve(null);
      }
    });
    const task: any[] = [];
    request.on("row", (columns) => {
      const rowdata: any = {};
      columns.forEach((column: any) => {
        rowdata[column.metadata.colName] = column.value;
      });

      task.push(rowdata);
    });
    request.on("requestCompleted", () => {
      resolve(task);
    });
    request.addParameter("ID", TYPES.Int, _id);
    connection.execSql(request);
  });
};

export const setTaskComplainant = (
  connection: Connection,
  complainant: any,
  task: any
) => {
  const query = `UPDATE Tasks SET complainant_id = @Complainant WHERE id = @TaskID`;

  const request = new Request(query, (err) => {
    if (err) {
      console.log("request error =>", err);
    }
    connection.close();
  });

  request.addParameter("Complainant", TYPES.Int, complainant);
  request.addParameter("TaskID", TYPES.Int, task);
  connection.execSql(request);
};

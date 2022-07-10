import { connection } from "../../database.js";

export interface Employee {
  id: number;
  fullName: string;
  cpf: string;
  email: string;
  companyId: number;
}

export async function findById(id: number) {
  const result = await connection.query<Employee, [number]>(
    "SELECT * FROM employees WHERE id=$1",
    [id]
  );

  return result.rows[0];
}

export async function searchEmployeeAtCompany(employeeId:number,companyId:number){
  const result = await connection.query<Employee, [number, number]>(
    `SELECT * FROM employees WHERE id=$1 and "companyId"=$2`,
    [employeeId,companyId]
  );

  return result.rows[0];
}

export const employeeRepository ={
  findById,
  searchEmployeeAtCompany,
};
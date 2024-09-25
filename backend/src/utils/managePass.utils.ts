import bcrypt from "bcrypt";

const saltRound: number = parseInt(process.env.SALT_ROUNDS || "12");

export const hashPass = async (password: string): Promise<string | undefined> => {
  try {
    
    const hashPas: string = await bcrypt.hash(password, saltRound);

    if (!hashPas) {
      const error: string = "Error hashing password";
      return error;
    }

    return hashPas;
  } catch (error: any) {
    console.log(error);
  }
};

export const verifyPass = async (
  password: string,
  hash: string,
): Promise<boolean | string | undefined> => {
  try {
    const compare = await bcrypt.compare(password, hash);

    if (!compare) {
      const error: string = "Invalid password";
      return error;
    }

    return compare;
  } catch (error: any) {
    console.log(error);
    
  }
};

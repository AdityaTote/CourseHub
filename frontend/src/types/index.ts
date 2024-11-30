export interface Transaction {
    id: number;
    amount: number;
    date: string;
    status: string;
  }

export interface Course {
    id: string;
    title: string;
    description: string;
    imageURL: string;
    price: string;
  };

export interface UserCourse {
    id: string;
    title: string;
    description: string;
    price: number;
    imageURL: string;
    creater:{
      firstName: string;
      lastName: string;
    }
  }

export interface CourseResponse {
    data: {
      id: string;
      isPurchased: boolean;
      adminId: string;
      error?: string;
    };
  }

export interface AdminTransactions {
    id: string;
    tansactionId: string;
    amount: string;
    createdAt: Date;
}

export interface UserTransactions {
  id: string;
  address: string;
  amount: string;
  createdAt: Date;
  signature: string;
  course: {
      title: string;
  };
}
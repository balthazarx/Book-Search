export interface Book {
    bookId: string;
    title: string;
    authors: string[];
    description: string;
    image?: string;
    link?: string;
  }
  
  export interface SavedBooksData {
    me: {
      _id: string;
      username: string;
      email: string;
      savedBooks: Book[];
    };
  }
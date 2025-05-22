// app/api/users.ts
import { User, userSchema } from '@/lib/schemas/user'; // Import the User type and schema

const USERS_ENDPOINT = "/api/users"


export async function createUser(userData: User) {
  try {

    userSchema.parse(userData);

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${USERS_ENDPOINT}`, { // Assuming you have a /api/users endpoint
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {

      const errorData = await response.json();
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${
          errorData.message || 'An error occurred'
        }`,
      );
    }

    return await response.json(); // Assuming the API returns the created user
  } catch (error: any) {
    // Handle validation errors and other errors
    console.error('Error creating user:', error);
    if (error instanceof Error) {
      throw error; // Re-throw the error to be handled by the calling component
    }
    throw new Error('An unexpected error occurred.');
  }
}

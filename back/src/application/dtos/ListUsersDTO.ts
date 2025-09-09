import { User } from "@/core/domain/User";

type ListUsersInputDTO = {
  page?: number;
  page_size?: number;
};

type ListUsersOutputDTO = {
  page: number;
  page_size: number;
  total_pages: number;
  total_items: number;
  data: User[];
};

export { ListUsersInputDTO, ListUsersOutputDTO };

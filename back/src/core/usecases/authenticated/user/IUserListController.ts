import {
  PaginationInputParamsDTO,
  PaginationOutputDTO,
} from "@/application/dtos/shared/PaginationDTO";
import {
  User,

} from "@/core/domain/User";
import { IAuthenticatedController } from "@/core/usecases/IAuthenticatedController";

type ListUsersControllerFilters = UserValidPropsToFilter;

type ListUsersControllerPaginationInput = PaginationInputParamsDTO<
  UserValidPropsToOrderBy,
  ListUsersControllerFilters
>;

PAREI AQUI, TEM QUE CORRIGIR OS TIPOS DO INPUT COM PAGINATION, VERIFICAR QUAL A MELHOR SOLUÇÃO, SE É PASSAR UM TIPO PARA SERVIR TANTO PARA AS PROPS RETORNADA QUANTO PARA O ORDER_BY E ETC...

type IUserListController = IAuthenticatedController<
  ListUsersControllerPaginationInput,
  {},
  {},
  {},
  PaginationOutputDTO<User>
>;

export {
  IUserListController,
  ListUsersControllerFilters,
  ListUsersControllerPaginationInput,
};

import { ErrorsCodeType } from "@/core/shared/errors/types/error-codes-type";

interface BillUseCaseErrors {
  E_0_BLU_ADM_0001: ErrorsCodeType;
}

export const billUseCaseErrors: BillUseCaseErrors = {
  E_0_BLU_ADM_0001: {
    code: "E_0_BLU_ADM_0001",
    details: "Something went wrong when creating new user bill",
    actions: "Verify information send or create process",
    instance: "create-bill-usecase",
  },
};

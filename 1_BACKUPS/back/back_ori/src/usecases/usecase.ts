export interface Usecase<InputDto, OutputDto> {
  execute(input: InputDto): Promise<OutputDto>;
}

// pattern command

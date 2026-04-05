import instance from "./axios";

export interface HelpMessageRequest {
  message: string;
}

export interface HelpMessageResponse {
  success: boolean;
  data: {
    message: string;
    timestamp: string;
  };
}

/**
 * Send a message to the help center AI assistant
 * POST /api/help-center/message
 */
export const sendHelpMessage = async (
  request: HelpMessageRequest
): Promise<{ message: string }> => {
  const response = await instance.post<HelpMessageResponse>("/help-center/message", {
    message: request.message,
  });
  // axios interceptor returns response.data directly, so response is already the full response object
  const data = (response as unknown as HelpMessageResponse).data;
  return {
    message: data.message,
  };
};

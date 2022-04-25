import { useNavigate } from "react-router-dom";
import { useQuery } from 'react-query'

const LOCAL_KEY = 'api-key';

function useMephistoReview({
  taskId,
  hostname = "",
} = {}) {
  const navigate = useNavigate();

  const DATA_URL = taskId
    ? `${hostname}/data/${taskId}`
    : `${hostname}/data`;

  const FEEDBACK_URL = taskId
    ? `${hostname}/feedback/${taskId}`
    : `${hostname}/feedback`;

  const { isLoading, error, data } = useQuery(taskId ?? 'home', () =>
    fetch(DATA_URL, { method: "GET", headers: { 'x-api-key': localStorage.getItem(LOCAL_KEY) } })
      .then((res) => {
        if (res.status === 401) {
          navigate('/login');
        }
        return res.json();
      }),
    { refetchOnWindowFocus: false }
  );

  const submitFeedback = (feedback) =>
    fetch(FEEDBACK_URL, {
      method: "POST",
      headers: { 'x-api-key': localStorage.getItem(LOCAL_KEY), 'Content-Type': 'application/json' },
      body: JSON.stringify(feedback)
    })

  return {
    isLoading: isLoading,
    mode: data && data.mode,
    data: data && data.data,
    filterData: data && data.filter_data,
    submitFeedback: submitFeedback,
    totalPages: (data && data.total_pages) || 1,
    error: error,
  };
}

export { useMephistoReview };

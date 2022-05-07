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

  const SEARCH_URL = `${hostname}/search`;

  const API_KEY_HEADER = { 'x-api-key': localStorage.getItem(LOCAL_KEY) }

  const { isLoading, error, data } = useQuery(taskId ?? 'home', () =>
    fetch(DATA_URL, { method: "GET", headers: API_KEY_HEADER })
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
      headers: { ...API_KEY_HEADER, 'Content-Type': 'application/json' },
      body: JSON.stringify(feedback),
    });

  const useSearch = (query) =>
    useQuery(
      ['query', query],
      ({ queryKey }) => {
        return fetch(`${SEARCH_URL}?query=${encodeURIComponent(queryKey[1])}`, {
          method: "GET",
          headers: API_KEY_HEADER,
        }).then((res) => {
          return res.json();
        })
      },
      {
        refetchOnWindowFocus: false,
        enabled: false,
      }
    );


  return {
    data: data && data.data,
    error: error,
    filterData: data && data.filter_data,
    isLoading: isLoading,
    mode: data && data.mode,
    useSearch: useSearch,
    submitFeedback: submitFeedback,
    totalPages: (data && data.total_pages) || 1,
  };
}

export { useMephistoReview };

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

  const { isLoading, error, data } = useQuery(taskId ?? 'home', () => fetch(DATA_URL, { method: "GET", headers: { 'x-api-key': localStorage.getItem(LOCAL_KEY) } })
    .then((res) => {
      if (res.status === 401) {
        navigate('/login');
      }
      return res.json();
    })
  );

  return {
    isLoading: isLoading,
    mode: data && data.mode,
    data: data && data.data,
    filterData: data && data.filter_data,
    isFinished: data && data.finished,
    totalPages: (data && data.total_pages) || 1,
    error: error,
  };
}

export { useMephistoReview };

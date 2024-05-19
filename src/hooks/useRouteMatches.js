import { useRouteMatch } from "react-router-dom";

export default function useRouteMatches(paths) {
  return paths.map((path) => useRouteMatch(path)).filter(Boolean);
}

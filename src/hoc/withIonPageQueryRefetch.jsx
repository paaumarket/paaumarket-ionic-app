import useIonPageQueryRefetch from "@/hooks/useIonPageQueryRefetch";

export default function withIonPageQueryRefetch(Component) {
  return function (props) {
    useIonPageQueryRefetch();

    return <Component {...props} />;
  };
}

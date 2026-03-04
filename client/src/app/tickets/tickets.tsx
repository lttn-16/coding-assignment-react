import { Ticket, User } from "@acme/shared-models";
import styles from "./tickets.module.css";
import { useState, useCallback, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEY } from "./constants";
import Table from "./table";
import { Button, Input } from "antd";
import { debounce, keyBy } from "lodash";

const { Search } = Input;

export function Tickets() {
    const [searchText, setSearchText] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [users, setUsers] = useState<User[]>([]);

    const { isPending, data: tickets = [] } = useQuery<Ticket[]>({
        queryKey: [QUERY_KEY.GET_TICKETS],
        refetchOnWindowFocus: true,
        queryFn: () => fetch("/api/tickets").then((res) => res.json()),
    });

    const updateDebounced = useCallback(
        debounce(
            (value: string) => setDebouncedSearch(value.trim().toLowerCase()),
            300,
        ),
        [],
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(e.target.value);
        updateDebounced(e.target.value);
    };

    const formatDataUser = (tickets: Ticket[]) => {
        const userByKey = keyBy(users, "id");
        return tickets.map((el) => {
            return {
                ...el,
                assigneeName: el.assigneeId
                    ? userByKey[el.assigneeId]?.name
                    : "Unassigned",
            };
        });
    };

    const filteredTickets = useMemo(
        () =>
            debouncedSearch
                ? formatDataUser(
                      tickets.filter((t) =>
                          t.description
                              ?.toLowerCase()
                              .includes(debouncedSearch),
                      ),
                  )
                : formatDataUser(tickets),
        [tickets, debouncedSearch],
    );

    const getAllUser = async () => {
        const usersData = await fetch("/api/users").then((res) => res.json());
        setUsers(usersData);
    };

    useEffect(() => {
        getAllUser();
    }, []);

    return (
        <div className={styles["container"]}>
            <h2>Ticket List</h2>
            <div className={styles["flex"]}>
                <Search
                    placeholder="search for description..."
                    enterButton
                    value={searchText}
                    onChange={handleChange}
                />
                <div className={styles["button-group"]}>
                    <Button type="primary">New Ticket</Button>
                    <Button type="dashed">Change status</Button>
                </div>
            </div>
            <div className={styles["table"]}>
                <Table data={filteredTickets} loading={isPending} />
            </div>
        </div>
    );
}

export default Tickets;

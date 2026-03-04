import { Ticket, User } from "@acme/shared-models";
import styles from "./tickets.module.css";
import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEY, TICKET_STATUS } from "./constants";
import Table, { TableRef } from "./table";
import { Button, Dropdown, Input, MenuProps, Space } from "antd";
import { debounce, keyBy } from "lodash";
import { EllipsisOutlined } from "@ant-design/icons";

const { Search } = Input;

export function Tickets() {
    const [searchText, setSearchText] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [users, setUsers] = useState<User[]>([]);
    const tableRef = useRef<TableRef>(null);
    const queryClient = useQueryClient();

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

    const items = useMemo(
        () => [
            {
                key: TICKET_STATUS.COMPLETED,
                label: "Completed",
            },
            {
                key: TICKET_STATUS.INCOMPLETE,
                label: "Incomplete",
            },
        ],
        [],
    );

    const getAllUser = async () => {
        const usersData = await fetch("/api/users").then((res) => res.json());
        setUsers(usersData);
    };

    useEffect(() => {
        getAllUser();
    }, []);

    const handleChangeStatus: MenuProps["onClick"] = async (e) => {
        try {
            const selected = tableRef.current?.getSelectedRows() ?? [];
            if (selected.length === 0) {
                return;
            }
            if (e.key === TICKET_STATUS.COMPLETED) {
                for (const ticket of selected) {
                    if (ticket.completed) continue;
                    await fetch(`/api/tickets/${ticket.id}/complete`, {
                        method: "PUT",
                    });
                }
            } else {
                for (const ticket of selected) {
                    if(!ticket.completed) continue;
                    await fetch(`/api/tickets/${ticket.id}/complete`, {
                        method: "DELETE",
                    });
                }
            }
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEY.GET_TICKETS],
            });
        } catch (error) {
            console.error("Failed to change ticket status:", error);
        }
    };

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
                    <Space.Compact>
                        <Button>Change status</Button>
                        <Dropdown
                            menu={{ items, onClick: handleChangeStatus }}
                            placement="bottomRight"
                        >
                            <Button icon={<EllipsisOutlined />} />
                        </Dropdown>
                    </Space.Compact>
                </div>
            </div>
            <div className={styles["table"]}>
                <Table
                    ref={tableRef}
                    data={filteredTickets}
                    loading={isPending}
                />
            </div>
        </div>
    );
}

export default Tickets;

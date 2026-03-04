import { Ticket, User } from "@acme/shared-models";
import styles from "./tickets.module.css";
import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEY, TICKET_STATUS } from "./constants";
import Table, { TableRef } from "./table";
import { Button, Dropdown, Input, MenuProps, Space } from "antd";
import { debounce, keyBy } from "lodash";
import { EllipsisOutlined } from "@ant-design/icons";
import AddModal from "./modal";

const { Search } = Input;

export function Tickets() {
    const [searchText, setSearchText] = useState("");
    const [open, setOpen] = useState(false);
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState<string | null>(null);
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

    const filteredTickets = useMemo(() => {
        let result = tickets;
        if (filterStatus === TICKET_STATUS.COMPLETED) {
            result = result.filter((t) => t.completed);
        } else if (filterStatus === TICKET_STATUS.INCOMPLETE) {
            result = result.filter((t) => !t.completed);
        }
        if (debouncedSearch) {
            result = result.filter((t) =>
                t.description?.toLowerCase().includes(debouncedSearch),
            );
        }
        return formatDataUser(result);
    }, [tickets, debouncedSearch, filterStatus]);

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

    const filterItems = useMemo(
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
                    if (!ticket.completed) continue;
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

    const handleAddTicket = async (description: string) => {
        try {
            await fetch("/api/tickets", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ description }),
            });
            setOpen(false);
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEY.GET_TICKETS],
            });
        } catch (error) {
            console.error("Failed to add ticket:", error);
        }
    };

    const handleFilterStatus: MenuProps["onClick"] = (e) => {
        if (e.key === TICKET_STATUS.COMPLETED) {
            setFilterStatus(TICKET_STATUS.COMPLETED);
        } else {
            setFilterStatus(TICKET_STATUS.INCOMPLETE);
        }
    }

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
                    <Button type="primary" onClick={() => setOpen(true)}>
                        New Ticket
                    </Button>
                    <Space.Compact>
                        <Button>Change status</Button>
                        <Dropdown
                            menu={{ items, onClick: handleChangeStatus }}
                            placement="bottomRight"
                        >
                            <Button icon={<EllipsisOutlined />} />
                        </Dropdown>
                    </Space.Compact>
                    <Space.Compact>
                        <Button className={styles["button"]}>Filter status</Button>
                        <Dropdown
                            menu={{ items: filterItems, onClick: handleFilterStatus }}
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
            <AddModal
                open={open}
                onClose={() => setOpen(false)}
                onSubmit={handleAddTicket}
            />
        </div>
    );
}

export default Tickets;

import {
  Flex,
  Button,
  Heading,
  Spinner,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import type { Record } from "./domain/record";
import { useCallback, useEffect, useState } from "react";
import { fetchRecords } from "./utils/fetchRecords";
import { deleteRecord } from "./utils/deleteRecord";
import { RecordModal } from "./components/RecordModal";

export const App = () => {
  const [records, setRecords] = useState([] as Record[]);
  const [loading, setLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  // null なら新規登録、Record が入っていれば編集
  const [editRecord, setEditRecord] = useState(null as Record | null);

  const loadRecords = useCallback(() => {
    fetchRecords()
      .then((data) => {
        setRecords(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    loadRecords();
  }, [loadRecords]);

  const handleDelete = async (id: string) => {
    try {
      await deleteRecord(id);
      loadRecords();
    } catch (err) {
      console.error(err);
    }
  };

  // 新規登録ボタン:編集対象を空にしてから開く
  const handleCreate = () => {
    setEditRecord(null);
    onOpen();
  };

  // 編集ボタン:押した行の記録を覚えてから開く
  const handleEdit = (record: Record) => {
    setEditRecord(record);
    onOpen();
  };

  return (
    <VStack spacing={4} p={8} align="stretch">
      <Heading>シン学習記録一覧アプリ</Heading>
      <Button colorScheme="teal" alignSelf="start" onClick={handleCreate}>
        新規登録
      </Button>

      {loading ? (
        <Spinner data-testid="loading-spinner" />
      ) : (
        <Table>
          <Thead>
            <Tr>
              <Th w="60%">学習記録</Th>
              <Th w="40%">学習時間</Th>
              <Th w="1%" whiteSpace="nowrap" isNumeric></Th>
            </Tr>
          </Thead>
          <Tbody>
            {records.map((record) => (
              <Tr key={record.id}>
                <Td>{record.title}</Td>
                <Td>{record.time}</Td>
                <Td>
                  <Flex gap="1">
                    <Button
                      size="sm"
                      colorScheme="red"
                      onClick={() => handleDelete(record.id)}
                    >
                      削除
                    </Button>
                    <Button
                      size="sm"
                      colorScheme="blue"
                      onClick={() => handleEdit(record)}
                    >
                      編集
                    </Button>
                  </Flex>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}

      <RecordModal
        isOpen={isOpen}
        onClose={onClose}
        record={editRecord}
        onSaved={loadRecords}
      />
    </VStack>
  );
};

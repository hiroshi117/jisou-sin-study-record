import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { useForm, type UseFormReturn } from "react-hook-form";
import type { Record } from "../domain/record";
import { createRecord } from "../utils/createRecord";
import { updateRecord } from "../utils/updateRecord";

type FormValues = {
  title: string;
  time: number;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  record: Record | null;
  onSaved: () => void;
};

export const RecordModal = ({ isOpen, onClose, record, onSaved }: Props) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  }: UseFormReturn<FormValues> = useForm();

  // モーダルが開くたびに、フォームの中身を入れ替える
  useEffect(() => {
    if (!isOpen) return;
    if (record) {
      // 編集:押した行の値
      reset({ title: record.title, time: record.time });
    } else {
      // 新規:空
      reset({ title: "", time: undefined });
    }
  }, [isOpen, record, reset]);

  const onSubmit = async (values: FormValues) => {
    if (record) {
      // 編集:更新
      await updateRecord({
        id: record.id,
        title: values.title,
        time: Number(values.time),
      });
    } else {
      // 新規:登録
      await createRecord({
        title: values.title,
        time: Number(values.time),
      });
    }
    onSaved();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{record ? "記録編集" : "新規登録"}</ModalHeader>
        <ModalCloseButton />
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalBody>
            <FormControl isInvalid={!!errors.title} mb={4}>
              <FormLabel>学習記録</FormLabel>
              <Input
                placeholder="例: React入門"
                {...register("title", { required: "内容の入力は必須です" })}
              />
              <FormErrorMessage>{errors.title?.message}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.time}>
              <FormLabel>学習時間</FormLabel>
              <Input
                type="number"
                placeholder="例: 2"
                {...register("time", {
                  required: "時間の入力は必須です",
                  min: { value: 0, message: "時間は0以上である必要があります" },
                  valueAsNumber: true,
                })}
              />
              <FormErrorMessage>{errors.time?.message}</FormErrorMessage>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              キャンセル
            </Button>
            <Button colorScheme="teal" type="submit" isLoading={isSubmitting}>
              {record ? "保存" : "登録"}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

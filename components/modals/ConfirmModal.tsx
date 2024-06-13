"use client";

import React, { FC } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ConfirmModalProps {
    children : React.ReactNode;
    onConfirm : () => void;
};


const ConfirmModal: FC<ConfirmModalProps> = ({children, onConfirm}) => {
  return <AlertDialog>
    <AlertDialogTrigger asChild>
        {children}
    </AlertDialogTrigger>
    <AlertDialogContent>
        <AlertDialogHeader>
            <AlertDialogTitle>Are your sure?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be redone.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
            <AlertDialogCancel>
                Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={onConfirm}>Confirm</AlertDialogAction>
        </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>;
};

export default ConfirmModal;

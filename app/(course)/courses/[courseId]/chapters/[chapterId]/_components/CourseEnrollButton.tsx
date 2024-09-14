"use client";

import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import React, { FC, useEffect } from "react";
import toast from "react-hot-toast";
import { MdTry } from "react-icons/md";

interface CourseEnrollButtonProps {
  price: number;
  courseId: string;
  courseTitle: string;
  courseDescription: string;
  courseImageUrl: string;
}
const CourseEnrollButton: FC<CourseEnrollButtonProps> = ({
  price,
  courseId,
  courseTitle,
  courseDescription,
  courseImageUrl,
}) => {
  const router = useRouter();
  const loadScript = async (src: string) => {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        reject(false);
      };
      document.body.appendChild(script);
    });
  };

  const { mutate: purchaseCourse, isPending } = useMutation({
    mutationFn: async () => {
      const { data } = await axios.post(`/api/courses/${courseId}/purchase`);
      return data;
    },
    onSuccess: (data) => {
      console.log(data);
      const paymentObject = new (window as any).Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: price * 100,
        currency: "INR",
        name: courseTitle,
        description: courseDescription,
        image: courseImageUrl,
        order_id: data.id,
        ...data,
        handler: async function (response: any) {
          console.log(response);
          try {
            const { data } = await axios.post(
              `/api/courses/${courseId}/verify`,
              {
                order_id: response.razorpay_order_id,
                payment_id: response.razorpay_payment_id,
                signature: response.razorpay_signature,
                course_id: courseId,
              }
            );
            router.push(`/courses/${courseId}`);
            router.refresh();
            toast.success("Course purchased successfuully!");
          } catch (error) {}
        },
      });

      paymentObject.open();
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          return router.push("/sign-in");
        }
      }
      toast.error("An error occurred. Please try again.");
    },
  });

  useEffect(() => {
    loadScript("https://checkout.razorpay.com/v1/checkout.js");
  }, []);
  return (
    <Button onClick={() => {
      purchaseCourse();
    }} size={"sm"} className=" w-full md:w-auto">
      {isPending ? "Processing..." : `Enroll for ${formatPrice(price)}`}
    </Button>
  );
};

export default CourseEnrollButton;

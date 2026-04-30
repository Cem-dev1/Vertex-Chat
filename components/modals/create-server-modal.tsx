"use client";

import axios from "axios";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic"; // 1. Dinamik import için ekledik

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/use-modal-store";

// 2. FileUpload'u SSR (Sunucu taraflı render) dışında bırakıyoruz. 
// Bu, "site bembeyaz oldu" hatasını kesin bitirir.
const FileUpload = dynamic(() => import("@/components/file-upload").then((mod) => mod.FileUpload), { 
  ssr: false 
});

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Server name is required."
  }),
  imageUrl: z.string().min(1, {
    message: "Server image is required."
  })
});

export const CreateServerModal = () => {
  const { isOpen, onClose, type } = useModal();
  const router = useRouter();
  
  // Hydration koruması
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const isModalOpen = isOpen && type === "createServer";

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      imageUrl: "",
    }
  });

  const isLoading = form.formState.isSubmitting;

const onSubmit = async (values: z.infer<typeof formSchema>) => {
  try {
    const response = await axios.post("/api/servers", values);
    form.reset();
    onClose();

    // Sayfayı reload etmeden hemen önce bir yönlendirme yapıp, 
    // tarayıcının o sayfayı taze bir şekilde çekmesini sağlıyoruz.
    router.push(`/servers/${response.data.id}`);
    
    // Küçük bir gecikme ile (timeout) sayfanın state'ini oturtup reload atabilirsin 
    // ama router.push zaten çoğu zaman yeterli olur.
    setTimeout(() => {
      window.location.reload();
    }, 100);

  } catch (error) {
    console.log("SERVER_CREATE_ERROR", error);
  }
}

  const handleClose = () => {
    form.reset();
    onClose();
    window.location.reload();
  }

  if (!isMounted) {
  return <div className="hidden" />; // null yerine gizli bir div dönmek layout stabilitesini koruyabilir.
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
    <DialogContent 
        className="z-[9999] bg-white text-black p-0 overflow-hidden border-none shadow-2xl"
      >
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Customize your server
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Give your server a personality with a name and an image. You can always change it later.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 px-6">
              <div className="flex items-center justify-center text-center">
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                     <div className="flex items-center justify-center min-h-[150px]"> 
                          <FileUpload
                            endpoint="serverImage"
                            value={field.value}
                            onChange={field.onChange}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                      Server name
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                        placeholder="Enter server name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="bg-gray-100 px-6 py-4">
              <Button variant="primary" disabled={isLoading}>
                Create
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
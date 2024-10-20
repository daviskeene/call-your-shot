import React from "react";
import { useUsers } from "../api/hooks/useUsers";
import { useCreateBet } from "../api/hooks/useBets";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CupSoda, User, Users, MessageSquare } from "lucide-react";
import { Combobox } from "@/components/ui/combobox";
import { useNavigate } from "react-router-dom";

const formSchema = z.object({
  bettorId: z.string().min(1, { message: "Bettor is required" }),
  betteeId: z.string().min(1, { message: "Bettee is required" }),
  shots: z.number().min(1, { message: "At least 1 shot is required" }),
  description: z.string().optional(),
});

const BetForm: React.FC = () => {
  const { data: users } = useUsers();
  const mutation = useCreateBet();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bettorId: "",
      betteeId: "",
      shots: 1,
      description: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const bettorId = parseInt(values.bettorId);
    const betteeId = parseInt(values.betteeId);

    mutation.mutate(
      {
        bettor_id: isNaN(bettorId) ? +values.bettorId : bettorId,
        bettee_id: isNaN(betteeId) ? +values.betteeId : betteeId,
        shots: values.shots,
        description: values.description,
      },
      {
        onSuccess: () => {
          form.reset();
          navigate("/");
        },
        onError: (error) => {
          console.error(error);
        },
      },
    );
  }

  const userOptions =
    users?.map((user) => ({
      label: user.name,
      value: user.id.toString(),
    })) || [];

  return (
    <Card className="shadow-2xl overflow-hidden">
      <CardHeader className="bg-white p-6">
        <CardTitle className="text-2xl font-bold text-black flex items-center space-x-2">
          <CupSoda className="h-6 w-6" />
          <span>Create New Bet</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 bg-white">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="bettorId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>Bettor</span>
                  </FormLabel>
                  <FormControl>
                    <Combobox
                      options={userOptions}
                      placeholder="Select or type a Bettor"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="betteeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center space-x-2">
                    <Users className="h-4 w-4" />
                    <span>Bettee</span>
                  </FormLabel>
                  <FormControl>
                    <Combobox
                      options={userOptions}
                      placeholder="Select or type a Bettee"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="shots"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center space-x-2">
                    <CupSoda className="h-4 w-4" />
                    <span>Number of Shots</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                      className="bg-gray-50 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </FormControl>
                  <FormDescription>
                    Enter the number of shots for this bet.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center space-x-2">
                    <MessageSquare className="h-4 w-4" />
                    <span>Description</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Describe the bet..."
                      className="bg-gray-50 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </FormControl>
                  <FormDescription>
                    Provide a brief description of the bet (optional).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Create Bet
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default BetForm;

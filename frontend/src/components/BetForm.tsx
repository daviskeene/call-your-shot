import React from "react";
import { useNavigate } from "react-router-dom";
import * as z from "zod";

import { useForm } from "react-hook-form";
import { CupSoda, User, Users, MessageSquare, ArrowUpDown } from "lucide-react";

import { useUsers } from "@/api/hooks/useUsers";
import { useCreateBet } from "@/api/hooks/useBets";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Combobox } from "@/components/ui/combobox";

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
        onSuccess: ({ id }) => {
          form.reset();
          navigate(`/bets/${id}`);
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

  // Function to swap the values of bettorId and betteeId
  const swapBettorAndBettee = () => {
    const currentBettorId = form.getValues("bettorId");
    const currentBetteeId = form.getValues("betteeId");
    form.setValue("bettorId", currentBetteeId);
    form.setValue("betteeId", currentBettorId);
  };

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
                    <span>Sender</span>
                  </FormLabel>
                  <FormControl>
                    <Combobox
                      options={userOptions}
                      placeholder="Select or type a Sender"
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
                    <span>Receiver</span>
                  </FormLabel>
                  <FormControl>
                    <Combobox
                      options={userOptions}
                      placeholder="Select or type a Receiver"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {form.getValues("betteeId") && form.getValues("bettorId") && (
              <div className="flex">
                <Button
                  type="button"
                  onClick={swapBettorAndBettee}
                  className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
                >
                  <ArrowUpDown className="h-4 w-4" />
                  <span>Swap Sender / Receiver</span>
                </Button>
              </div>
            )}
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

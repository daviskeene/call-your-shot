import React from 'react'
import { useUsers } from '../api/hooks/useUsers'
import { useCreateBet } from '../api/hooks/useBets'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

const formSchema = z.object({
  bettorId: z.string().min(1, { message: "Bettor is required" }),
  betteeId: z.string().min(1, { message: "Bettee is required" }),
  shots: z.number().min(1, { message: "At least 1 shot is required" }),
  description: z.string().optional(),
})

const BetForm: React.FC = () => {
  const { data: users } = useUsers()
  const mutation = useCreateBet()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bettorId: "",
      betteeId: "",
      shots: 1,
      description: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutation.mutate({
      bettor_id: parseInt(values.bettorId),
      bettee_id: parseInt(values.betteeId),
      shots: values.shots,
      description: values.description,
    }, {
      onSuccess: () => {
        form.reset()
      },
      onError: (error) => {
        console.error(error)
      }
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="bettorId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bettor</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Bettor" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {users?.map((user) => (
                    <SelectItem key={user.id} value={user.id.toString()}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="betteeId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bettee</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Bettee" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {users?.map((user) => (
                    <SelectItem key={user.id} value={user.id.toString()}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="shots"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Number of Shots</FormLabel>
              <FormControl>
                <Input type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value))} />
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
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Describe the bet..." />
              </FormControl>
              <FormDescription>
                Provide a brief description of the bet (optional).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">Create Bet</Button>
      </form>
    </Form>
  )
}

export default BetForm;
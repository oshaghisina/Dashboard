"use client"

import * as React from "react"

import { initialTickets } from "@/lib/mock-data/tickets"
import type { TicketRecord } from "@/lib/types"

function cloneInitialTickets() {
  return initialTickets.map((ticket) => ({
    ...ticket,
    messages: ticket.messages.map((message) => ({ ...message })),
  }))
}

interface CreateTicketInput {
  category: TicketRecord["category"]
  messageBody: string
  priority: TicketRecord["priority"]
  subject: string
}

interface TicketsContextValue {
  addReply: (ticketId: string, messageBody: string) => TicketRecord | null
  createTicket: (input: CreateTicketInput) => TicketRecord
  markViewed: (ticketId: string) => void
  tickets: TicketRecord[]
}

const TicketsContext = React.createContext<TicketsContextValue | null>(null)

export function TicketsProvider({ children }: { children: React.ReactNode }) {
  const [tickets, setTickets] = React.useState<TicketRecord[]>(() => cloneInitialTickets())

  const createTicket = React.useCallback((input: CreateTicketInput) => {
    const now = new Date().toISOString()
    const id = `ticket_${Date.now()}`
    const ticket: TicketRecord = {
      id,
      subject: input.subject.trim(),
      category: input.category,
      priority: input.priority,
      status: "waiting_for_support",
      createdAt: now,
      updatedAt: now,
      requesterName: "Sina Oshaghi",
      lastReplyPreview: input.messageBody.trim(),
      lastReplyAuthorType: "user",
      unread: false,
      messages: [
        {
          id: `${id}_msg_1`,
          authorType: "user",
          authorName: "Sina Oshaghi",
          body: input.messageBody.trim(),
          createdAt: now,
        },
      ],
    }

    setTickets((current) => [ticket, ...current])
    return ticket
  }, [])

  const addReply = React.useCallback((ticketId: string, messageBody: string) => {
    const now = new Date().toISOString()
    let updatedTicket: TicketRecord | null = null

    setTickets((current) =>
      current.map((ticket) => {
        if (ticket.id !== ticketId) {
          return ticket
        }

        updatedTicket = {
          ...ticket,
          status: "waiting_for_support",
          updatedAt: now,
          lastReplyPreview: messageBody.trim(),
          lastReplyAuthorType: "user",
          unread: false,
          messages: [
            ...ticket.messages,
            {
              id: `${ticketId}_msg_${ticket.messages.length + 1}`,
              authorType: "user",
              authorName: ticket.requesterName,
              body: messageBody.trim(),
              createdAt: now,
            },
          ],
        }

        return updatedTicket
      })
    )

    return updatedTicket
  }, [])

  const markViewed = React.useCallback((ticketId: string) => {
    setTickets((current) =>
      current.map((ticket) =>
        ticket.id === ticketId && ticket.unread
          ? { ...ticket, unread: false }
          : ticket
      )
    )
  }, [])

  return (
    <TicketsContext.Provider
      value={{
        addReply,
        createTicket,
        markViewed,
        tickets,
      }}
    >
      {children}
    </TicketsContext.Provider>
  )
}

export function useTickets() {
  const context = React.useContext(TicketsContext)

  if (!context) {
    throw new Error("useTickets must be used within TicketsProvider")
  }

  return context
}

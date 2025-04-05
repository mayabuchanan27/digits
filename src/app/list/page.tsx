import { getServerSession } from 'next-auth';
import { Col, Container, Row } from 'react-bootstrap';
import { loggedInProtectedPage } from '@/lib/page-protection';
import authOptions from '@/lib/authOptions';
import { Contact } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import ContactCard from '@/components/ContactCard';

/** Render a list of stuff for the logged in user. */
const ListPage = async () => {
  const session = await getServerSession(authOptions);
  loggedInProtectedPage(
    session as {
      user: { email: string; id: string; randomKey: string };
    } | null,
  );

  const owner = session?.user!.email ? session?.user!.email : '';
  const contacts: Contact[] = await prisma.contact.findMany({
    where: {
      owner,
    },
  });

  const notes = await prisma.note.findMany({
    where: {
      owner,
    },
  });

  return (
    <main>
      <Container id="list" fluid className="py-3">
        <Container>
          <Row>
            <Col>
              <h1 className="text-center">List Contacts</h1>
              <Row xs={1} md={2} lg={3} className="g-4">
                {contacts.map((contact: Contact) => (
                  <Col key={`${contact.firstName}-${contact.lastName}-${contact}`}>
                    <ContactCard contact={contact} notes={notes.filter(note => (note.contactId === contact.id))} />
                  </Col>
                ))}
              </Row>
            </Col>
          </Row>
        </Container>
      </Container>
    </main>
  );
};

export default ListPage;

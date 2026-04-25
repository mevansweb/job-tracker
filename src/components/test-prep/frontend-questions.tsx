import { useState } from 'react'

import Iframe from 'react-iframe'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export const FrontendQuestions = () => {
  const [answerUrl, setAnswerUrl] = useState('')
  return (
    <div className="flex p-4">
      <div className={`${answerUrl ? 'mx-10' : 'mx-auto'} grid w-200 gap-8 p-8`}>
        <h1 className="text-xl font-bold">
          Article: I Will Never Walk Into a Frontend Interview Without Solving These 20 Questions
          First
        </h1>
        <a
          className="font-bold underline"
          target="_blank"
          href="https://medium.com/write-a-catalyst/i-will-never-walk-into-a-frontend-interview-without-solving-these-20-questions-first-035e2c266de5"
        >
          View Article
        </a>
        <Card className="my-4 p-4">
          <h1 className="text-lg font-bold">Part 1: The Foundations (Beginner)</h1>
          <p>
            At this stage, interviewers are looking to see if you understand the core mechanics of
            JavaScript. It is not just about knowing the syntax; it is about knowing how and why
            things work.
          </p>
          <ul className="list-inside list-decimal">
            <li>
              What is the event loop? Be prepared to explain the call stack, task queue, and
              microtask queue.
              <br />
              <Button
                className="cursor-pointer text-blue-500 underline"
                onClick={() =>
                  setAnswerUrl(
                    'https://www.google.com/search?igu=1&q=What+is+the+event+loop%3F+Explain+the+call+stack%2C+task+queue%2C+and+microtask+queue.&sca_esv=6386fee4484b402e&sxsrf=ANbL-n7SdYDzM5Z6Bh4ENFdG5rI7IY8rdg%3A1777148632728&source=hp&ei=2CLtaY63Kp7i5NoPne7guAk&iflsig=AFdpzrgAAAAAae0w6MHbnBQ3O53Op6kGjJXRoUEZhQvs&ved=0ahUKEwiOg9zH6omUAxUeMVkFHR03GJcQ4dUDCBo&uact=5&oq=What+is+the+event+loop%3F+Explain+the+call+stack%2C+task+queue%2C+and+microtask+queue.&gs_lp=Egdnd3Mtd2l6IlBXaGF0IGlzIHRoZSBldmVudCBsb29wPyBFeHBsYWluIHRoZSBjYWxsIHN0YWNrLCB0YXNrIHF1ZXVlLCBhbmQgbWljcm90YXNrIHF1ZXVlLjIHECMY6gIYJzIHECMY6gIYJzIHECMY6gIYJzIHECMY6gIYJzIHECMY6gIYJzIHECMY6gIYJzIHECMY6gIYJzIHECMY6gIYJ0iiN1DNAViOJHABeACQAQCYAQCgAQCqAQC4AQPIAQD4AQL4AQGYAgGgAgioAgqYAwjxBQ21aPlHIkmckgcBMaAHALIHALgHAMIHAzItMcgHBoAIAQ&sclient=gws-wiz&zx=1777148650547'
                  )
                }
                variant="link"
              >
                Answer
              </Button>
            </li>
            <li>
              What are closures? Be ready to answer closure-based output questions and provide a
              real-life use case (like data privacy or function factories).
              <br />
              <Button
                className="cursor-pointer text-blue-500 underline"
                onClick={() =>
                  setAnswerUrl(
                    'https://www.google.com/search?igu=1&q=What+are+closures%3F+Answer+closure-based+output+questions+and+provide+a+real-life+use+case+%28like+data+privacy+or+function+factories%29.&sca_esv=6386fee4484b402e&sxsrf=ANbL-n4juyYxKX2qs1z7h0qxuYJY1MprCQ%3A1777148650670&ei=6iLtacnRKI2h5NoPqoaDyQ0&biw=1855&bih=1003&ved=0ahUKEwjJ7qTQ6omUAxWNEFkFHSrDINkQ4dUDCBE&uact=5&oq=What+are+closures%3F+Answer+closure-based+output+questions+and+provide+a+real-life+use+case+%28like+data+privacy+or+function+factories%29.&gs_lp=Egxnd3Mtd2l6LXNlcnAihAFXaGF0IGFyZSBjbG9zdXJlcz8gQW5zd2VyIGNsb3N1cmUtYmFzZWQgb3V0cHV0IHF1ZXN0aW9ucyBhbmQgcHJvdmlkZSBhIHJlYWwtbGlmZSB1c2UgY2FzZSAobGlrZSBkYXRhIHByaXZhY3kgb3IgZnVuY3Rpb24gZmFjdG9yaWVzKS5IAFAAWABwAHgBkAEAmAEAoAEAqgEAuAEDyAEA-AEC-AEBmAIAoAIAmAMAkgcAoAcAsgcAuAcAwgcAyAcAgAgB&sclient=gws-wiz-serp'
                  )
                }
                variant="link"
              >
                Answer
              </Button>
            </li>
            <li>
              What is prototypal inheritance? Explain this with a concrete example. Also, be ready
              to answer: What sits at the very top of the prototype chain?
              <br />
              <Button
                className="cursor-pointer text-blue-500 underline"
                onClick={() =>
                  setAnswerUrl(
                    'https://www.google.com/search?igu=1&q=What+is+prototypal+inheritance%3F+Explain+this+with+a+concrete+example.+What+sits+at+the+very+top+of+the+prototype+chain%3F&sca_esv=6386fee4484b402e&biw=1855&bih=1003&sxsrf=ANbL-n78LYbAQrKcWKzb_a0o7tQt9BPI-g%3A1777148823698&ei=lyPtaaWHKoCt5NoPleHWsQ4&ved=0ahUKEwjlruWi64mUAxWAFlkFHZWwNeYQ4dUDCBE&uact=5&oq=What+is+prototypal+inheritance%3F+Explain+this+with+a+concrete+example.+What+sits+at+the+very+top+of+the+prototype+chain%3F&gs_lp=Egxnd3Mtd2l6LXNlcnAid1doYXQgaXMgcHJvdG90eXBhbCBpbmhlcml0YW5jZT8gRXhwbGFpbiB0aGlzIHdpdGggYSBjb25jcmV0ZSBleGFtcGxlLiBXaGF0IHNpdHMgYXQgdGhlIHZlcnkgdG9wIG9mIHRoZSBwcm90b3R5cGUgY2hhaW4_MgcQIxjqAhgnMgcQIxjqAhgnMgcQIxjqAhgnMgcQIxjqAhgnMgcQIxjqAhgnMgcQIxjqAhgnMgcQIxjqAhgnMgcQIxjqAhgnMgcQIxjqAhgnMgcQIxjqAhgnMhcQABiABBiKBRiRAhjnBhjqAhi0AtgBATIXEAAYgAQYigUYkQIY5wYY6gIYtALYAQEyFxAAGIAEGIoFGJECGOcGGOoCGLQC2AEBMhAQLhgDGI8BGOoCGLQC2AEBMhAQABgDGI8BGOoCGLQC2AEBMhAQABgDGI8BGOoCGLQC2AEBMhAQABgDGI8BGOoCGLQC2AEBMhAQABgDGI8BGOoCGLQC2AEBSNh6UOgGWLh3cAF4AZABAJgBAKABAKoBALgBA8gBAPgBAfgBApgCAaACBqgCEpgDBvEFgk-mBVbyhI-6BgYIARABGAGSBwExoAcAsgcAuAcAwgcDMi0xyAcFgAgB&sclient=gws-wiz-serp'
                  )
                }
                variant="link"
              >
                Answer
              </Button>
            </li>
            <li>
              What are map, filter, and reduce? Knowing how to use them is basic; writing a polyfill
              for reduce proves you actually understand them.
              <br />
              <Button
                className="cursor-pointer text-blue-500 underline"
                onClick={() =>
                  setAnswerUrl(
                    'https://www.google.com/search?igu=1&q=What+are+map%2C+filter%2C+and+reduce+and+how+to+use+them%3F+Write+a+polyfill+for+reduce.&sca_esv=6386fee4484b402e&biw=1855&bih=1003&sxsrf=ANbL-n7U0nmTnIgYtmTImban48J7A95HdA%3A1777148923661&ei=-yPtacuAKK3l5NoPwsTA6Qs&ved=0ahUKEwiL6rrS64mUAxWtMlkFHUIiML0Q4dUDCBE&uact=5&oq=What+are+map%2C+filter%2C+and+reduce+and+how+to+use+them%3F+Write+a+polyfill+for+reduce.&gs_lp=Egxnd3Mtd2l6LXNlcnAiUldoYXQgYXJlIG1hcCwgZmlsdGVyLCBhbmQgcmVkdWNlIGFuZCBob3cgdG8gdXNlIHRoZW0_IFdyaXRlIGEgcG9seWZpbGwgZm9yIHJlZHVjZS5IrjlQAFj9LnAAeAGQAQCYAU-gAeYDqgEBOLgBA8gBAPgBAvgBAZgCAqACjAHCAgQQIRgKmAMAkgcBMqAHoA-yBwEyuAeMAcIHAzAuMsgHBIAIAQ&sclient=gws-wiz-serp'
                  )
                }
                variant="link"
              >
                Answer
              </Button>
            </li>
            <li>
              What are call, bind, and apply? Similar to the above, be prepared to write a polyfill
              for bind.
              <br />
              <Button
                className="cursor-pointer text-blue-500 underline"
                onClick={() =>
                  setAnswerUrl(
                    'https://www.google.com/search?igu=1&q=What+are+call%2C+bind%2C+and+apply+and+how+to+use+them%3F+Write+a+polyfill+for+bind.&sca_esv=6386fee4484b402e&biw=1855&bih=1003&sxsrf=ANbL-n5zTviOAIlpxr6YUOv625bYTb1m3Q%3A1777149062226&ei=hiTtaf7CDaCviLMPmOSZ-Qw&ved=0ahUKEwj-ncSU7ImUAxWgF2IAHRhyJs8Q4dUDCBE&uact=5&oq=What+are+call%2C+bind%2C+and+apply+and+how+to+use+them%3F+Write+a+polyfill+for+bind.&gs_lp=Egxnd3Mtd2l6LXNlcnAiTldoYXQgYXJlIGNhbGwsIGJpbmQsIGFuZCBhcHBseSBhbmQgaG93IHRvIHVzZSB0aGVtPyBXcml0ZSBhIHBvbHlmaWxsIGZvciBiaW5kLkiiWFAAWPxRcAB4AZABAJgBW6AB0AqqAQIyM7gBA8gBAPgBAvgBAZgCBaACgQPCAgQQIRgKwgIFEAAY7wXCAggQABiJBRiiBMICCBAAGIAEGKIEmAMAkgcBNaAHmySyBwE1uAeBA8IHBTAuMS40yAcQgAgB&sclient=gws-wiz-serp'
                  )
                }
                variant="link"
              >
                Answer
              </Button>
            </li>
            <li>
              What are callbacks, promises, and async/await? Understand the evolution of
              asynchronous JavaScript.
              <br />
              <Button
                className="cursor-pointer text-blue-500 underline"
                onClick={() =>
                  setAnswerUrl(
                    'https://www.google.com/search?igu=1&q=What+are+callbacks%2C+promises%2C+and+async%2Fawait%3F+explain+the+evolution+of+asynchronous+JavaScript.&sca_esv=6386fee4484b402e&biw=1855&bih=1003&sxsrf=ANbL-n5ip0-T7ujzoq_V6Hh9bUqGDzqOLA%3A1777149158185&ei=5iTtaen9Cpix5NoP2_DSsAw&ved=0ahUKEwjpiKXC7ImUAxWYGFkFHVu4FMYQ4dUDCBE&uact=5&oq=What+are+callbacks%2C+promises%2C+and+async%2Fawait%3F+explain+the+evolution+of+asynchronous+JavaScript.&gs_lp=Egxnd3Mtd2l6LXNlcnAiYFdoYXQgYXJlIGNhbGxiYWNrcywgcHJvbWlzZXMsIGFuZCBhc3luYy9hd2FpdD8gZXhwbGFpbiB0aGUgZXZvbHV0aW9uIG9mIGFzeW5jaHJvbm91cyBKYXZhU2NyaXB0LkizH1AAWLEDcAB4AZABAJgBUKABzwGqAQEzuAEDyAEA-AEC-AEBmAIAoAIAmAMAkgcAoAfkBLIHALgHAMIHAMgHAIAIAQ&sclient=gws-wiz-serp'
                  )
                }
                variant="link"
              >
                Answer
              </Button>
            </li>
            <li>
              What is debouncing? You will likely be asked to write a polyfill for debounce.
              <br />
              <Button
                className="cursor-pointer text-blue-500 underline"
                onClick={() =>
                  setAnswerUrl(
                    'https://www.google.com/search?igu=1&q=What+is+debouncing%3F+Write+a+polyfill+for+debounce.&sca_esv=6386fee4484b402e&biw=1855&bih=1003&sxsrf=ANbL-n7H_wA4Li5vxtKgGzKwb6TfW1kqyg%3A1777153153188&ei=gTTtadabC6Gu5NoPpZXM2AI&ved=0ahUKEwiW4KCz-4mUAxUhF1kFHaUKEysQ4dUDCBE&uact=5&oq=What+is+debouncing%3F+Write+a+polyfill+for+debounce.&gs_lp=Egxnd3Mtd2l6LXNlcnAiMldoYXQgaXMgZGVib3VuY2luZz8gV3JpdGUgYSBwb2x5ZmlsbCBmb3IgZGVib3VuY2UuMgUQIRigATIFECEYoAEyBRAhGKABMgUQIRigATIFECEYoAFIj0JQAFjNNXAAeACQAQCYAVCgAY8CqgEBNLgBA8gBAPgBAvgBAZgCAqACkgHCAggQABiJBRiiBMICCBAAGIAEGKIEwgIFEAAY7wWYAwCSBwEyoAfaCLIHATK4B5IBwgcDMi0yyAcHgAgB&sclient=gws-wiz-serp'
                  )
                }
                variant="link"
              >
                Answer
              </Button>
            </li>
            <li>
              Flatten a nested array. A classic whiteboard problem. Example Input: [1, [2, 3, [4,
              5], 6]] Expected Output: [1, 2, 3, 4, 5, 6]
              <br />
              <Button
                className="cursor-pointer text-blue-500 underline"
                onClick={() =>
                  setAnswerUrl(
                    'https://www.google.com/search?igu=1&q=Flatten+a+nested+array+in+javascript.+Example+Input%3A+%5B1%2C+%5B2%2C+3%2C+%5B4%2C+5%5D%2C+6%5D%5D+Expected+Output%3A+%5B1%2C+2%2C+3%2C+4%2C+5%2C+6%5D&sca_esv=6386fee4484b402e&biw=1855&bih=1003&sxsrf=ANbL-n54mt5mOtwKqrrMoa5SUsRcEFVy4Q%3A1777153214831&ei=vjTtaeeyMvqg5NoP0siQ0Qw&ved=0ahUKEwjnidPQ-4mUAxV6EFkFHVIkJMoQ4dUDCBE&uact=5&oq=Flatten+a+nested+array+in+javascript.+Example+Input%3A+%5B1%2C+%5B2%2C+3%2C+%5B4%2C+5%5D%2C+6%5D%5D+Expected+Output%3A+%5B1%2C+2%2C+3%2C+4%2C+5%2C+6%5D&gs_lp=Egxnd3Mtd2l6LXNlcnAib0ZsYXR0ZW4gYSBuZXN0ZWQgYXJyYXkgaW4gamF2YXNjcmlwdC4gRXhhbXBsZSBJbnB1dDogWzEsIFsyLCAzLCBbNCwgNV0sIDZdXSBFeHBlY3RlZCBPdXRwdXQ6IFsxLCAyLCAzLCA0LCA1LCA2XTIHECMY6gIYJzIHECMY6gIYJzIHECMY6gIYJzIHECMY6gIYJzIHECMY6gIYJzIHECMY6gIYJzIHECMY6gIYJzIXEAAYgAQYigUYkQIY5wYY6gIYtALYAQEyFxAAGIAEGIoFGJECGOcGGOoCGLQC2AEBMhcQABiABBiKBRiRAhjnBhjqAhi0AtgBATIXEAAYgAQYigUYkQIY5wYY6gIYtALYAQEyFxAAGIAEGIoFGJECGOcGGOoCGLQC2AEBMhAQLhgDGI8BGOoCGLQC2AEBMhAQABgDGI8BGOoCGLQC2AEBMhAQABgDGI8BGOoCGLQC2AEBMhAQABgDGI8BGOoCGLQC2AEBSObOAVAAWIy4AXACeAGQAQCYAQCgAQCqAQC4AQPIAQD4AQL4AQGYAgKgAg...'
                  )
                }
                variant="link"
              >
                Answer
              </Button>
            </li>
          </ul>
        </Card>
        <Card className="my-4 p-4">
          <h1 className="text-lg font-bold">Part 2: Stepping It Up (Intermediate)</h1>
          <p>
            Intermediate questions test your ability to handle edge cases, understand browser
            mechanics, and manipulate complex data structures.
          </p>
          <ul className="list-inside list-decimal">
            <li>
              Implement a throttle function. Constraint: Cover all edge cases. The naive approach
              found on basic tutorials often fails interview stress tests.
              <br />
              <Button
                className="cursor-pointer text-blue-500 underline"
                onClick={() =>
                  setAnswerUrl(
                    'https://www.google.com/search?igu=1&q=Implement+a+throttle+function+in+javascript.+Constraint%3A+Cover+all+edge+cases.+&sca_esv=6386fee4484b402e&biw=1855&bih=1003&sxsrf=ANbL-n764Uc6cUjjSvy2HvH-J5rpYcyrvQ%3A1777153317106&ei=JTXtafuYBoOv5NoPwqetkA0&ved=0ahUKEwi7v7WB_ImUAxWDF1kFHcJTC9IQ4dUDCBE&uact=5&oq=Implement+a+throttle+function+in+javascript.+Constraint%3A+Cover+all+edge+cases.+&gs_lp=Egxnd3Mtd2l6LXNlcnAiT0ltcGxlbWVudCBhIHRocm90dGxlIGZ1bmN0aW9uIGluIGphdmFzY3JpcHQuIENvbnN0cmFpbnQ6IENvdmVyIGFsbCBlZGdlIGNhc2VzLiBI_D5QAFiILHAAeAGQAQCYAWCgAbMIqgECMTe4AQPIAQD4AQL4AQGYAgSgApMCwgIEECEYCpgDAJIHATSgB-EgsgcBNLgHkwLCBwMwLjTIBweACAE&sclient=gws-wiz-serp'
                  )
                }
                variant="link"
              >
                Answer
              </Button>
            </li>
            <li>
              Implement a debounce function. Similar to the above, but with its own unique edge
              cases.
              <br />
              <Button
                className="cursor-pointer text-blue-500 underline"
                onClick={() =>
                  setAnswerUrl(
                    'https://www.bing.com/search?q=Implement%20a%20debounce%20function.%20Constraint%3A%20Cover%20all%20edge%20cases.%20%20%20%20%20%20%20%20%20%20%20%20%20&qs=n&form=QBRE&sp=-1&lq=0&pq=implement%20a%20debounce%20function.%20constraint%3A%20cover%20all%20edge%20cases.%20%20%20%20%20%20%20%20%20%20%20%20%20&sc=2-77&sk=&cvid=EBC2BC91D6944082AC30E21929F4F6FE'
                  )
                }
                variant="link"
              >
                Answer
              </Button>
            </li>
            <li>
              Implement a polyfill for Promise. This is a heavy hitter that deeply tests your
              understanding of asynchronous state management.
              <br />
              <Button
                className="cursor-pointer text-blue-500 underline"
                onClick={() =>
                  setAnswerUrl(
                    'https://www.google.com/search?igu=1&q=Implement+a+polyfill+for+Promise+in+javascript&sca_esv=6386fee4484b402e&biw=1855&bih=1003&sxsrf=ANbL-n6UYG2YOqKkigeybPe3LxG_TZfXug%3A1777153415845&ei=hzXtaeKpM5XZ5NoP4cebyAM&ved=0ahUKEwiiicCw_ImUAxWVLFkFHeHjBjkQ4dUDCBE&uact=5&oq=Implement+a+polyfill+for+Promise+in+javascript&gs_lp=Egxnd3Mtd2l6LXNlcnAiLkltcGxlbWVudCBhIHBvbHlmaWxsIGZvciBQcm9taXNlIGluIGphdmFzY3JpcHQyBRAhGKABMgUQIRigATIFECEYoAEyBRAhGKsCSPwuUABYjihwAHgBkAEAmAFxoAHxCaoBBDE1LjG4AQPIAQD4AQL4AQGYAhCgArkKwgIGEAAYFhgewgIFEAAY7wWYAwCSBwQxNS4xoAeJN7IHBDE1LjG4B7kKwgcGMC4xMy4zyAclgAgB&sclient=gws-wiz-serp'
                  )
                }
                variant="link"
              >
                Answer
              </Button>
            </li>
            <li>
              Write a curried version of a function.
              <br />
              <Button
                className="cursor-pointer text-blue-500 underline"
                onClick={() =>
                  setAnswerUrl(
                    'https://www.google.com/search?igu=1&q=Write+a+curried+version+of+a+function+in+javascript.&sca_esv=6386fee4484b402e&biw=1855&bih=1003&sxsrf=ANbL-n5EPSd21FKzd6BGBxHRfQKes-a6wQ%3A1777153490274&ei=0jXtafW3EM_j5NoPndioiQM&ved=0ahUKEwj16P7T_ImUAxXPMVkFHR0sKjEQ4dUDCBE&uact=5&oq=Write+a+curried+version+of+a+function+in+javascript.&gs_lp=Egxnd3Mtd2l6LXNlcnAiNFdyaXRlIGEgY3VycmllZCB2ZXJzaW9uIG9mIGEgZnVuY3Rpb24gaW4gamF2YXNjcmlwdC4yCBAAGIkFGKIEMgUQABjvBTIFEAAY7wVIyCtQAFioKXAAeAGQAQCYAWqgAdIJqgEEMTUuMbgBA8gBAPgBAvgBAZgCD6ACtAnCAgUQIRigAcICCBAAGIAEGKIEmAMAkgcEMTMuMqAH8SKyBwQxMy4yuAe0CcIHBjAuMTQuMcgHJIAIAQ&sclient=gws-wiz-serp'
                  )
                }
                variant="link"
              >
                Answer
              </Button>
            </li>
            <li>
              How does JavaScript work under the hood?
              <br />
              <Button
                className="cursor-pointer text-blue-500 underline"
                onClick={() =>
                  setAnswerUrl(
                    'https://www.google.com/search?igu=1&q=How+does+JavaScript+work+under+the+hood%3F&sca_esv=6386fee4484b402e&biw=1855&bih=1003&sxsrf=ANbL-n6yw8ZOCJVS5DowE79SkJ31mpKT3w%3A1777153617303&ei=UTbtaeacErav5NoP5q-ImA8&ved=0ahUKEwimiciQ_YmUAxW2F1kFHeYXAvMQ4dUDCBE&uact=5&oq=How+does+JavaScript+work+under+the+hood%3F&gs_lp=Egxnd3Mtd2l6LXNlcnAiKEhvdyBkb2VzIEphdmFTY3JpcHQgd29yayB1bmRlciB0aGUgaG9vZD8yBhAAGBYYHjIGEAAYFhgeMgYQABgWGB4yBhAAGBYYHjIGEAAYFhgeMgYQABgWGB4yBhAAGBYYHjILEAAYgAQYigUYhgMyCBAAGIAEGKIEMgUQABjvBUi3CVAAWABwAHgBkAEAmAFkoAFkqgEDMC4xuAEDyAEA-AEC-AEBmAIBoAJsmAMAkgcDMC4xoAelB7IHAzAuMbgHbMIHAzItMcgHBYAIAQ&sclient=gws-wiz-serp'
                  )
                }
                variant="link"
              >
                Answer
              </Button>
            </li>
            <li>
              Explain the Event Loop. You must clearly differentiate between the Macrotask queue and
              the Microtask queue.
              <br />
              <Button
                className="cursor-pointer text-blue-500 underline"
                onClick={() =>
                  setAnswerUrl(
                    'https://www.google.com/search?igu=1&q=Explain+the+Event+Loop.+Differentiate+between+the+Macrotask+queue+and+the+Microtask+queue.&sca_esv=6386fee4484b402e&biw=1855&bih=1003&sxsrf=ANbL-n5h5Zp-bDMoGcNT2Xo8jpQO38wWwg%3A1777153650742&ei=cjbtaaGELdes5NoP_s3GoAs&ved=0ahUKEwihhcGg_YmUAxVXFlkFHf6mEbQQ4dUDCBE&uact=5&oq=Explain+the+Event+Loop.+Differentiate+between+the+Macrotask+queue+and+the+Microtask+queue.&gs_lp=Egxnd3Mtd2l6LXNlcnAiWkV4cGxhaW4gdGhlIEV2ZW50IExvb3AuIERpZmZlcmVudGlhdGUgYmV0d2VlbiB0aGUgTWFjcm90YXNrIHF1ZXVlIGFuZCB0aGUgTWljcm90YXNrIHF1ZXVlLkiLF1AAWABwAHgBkAEAmAFjoAGYAaoBATK4AQPIAQD4AQL4AQGYAgCgAgCYAwCSBwCgB9IFsgcAuAcAwgcAyAcAgAgB&sclient=gws-wiz-serp'
                  )
                }
                variant="link"
              >
                Answer
              </Button>
            </li>
            <li>
              How can you implement a retry mechanism for fetching data?
              <br />
              <Button
                className="cursor-pointer text-blue-500 underline"
                onClick={() =>
                  setAnswerUrl(
                    'https://www.google.com/search?igu=1&q=How+can+you+implement+a+retry+mechanism+for+fetching+data+in+javascript%3F&sca_esv=6386fee4484b402e&biw=1855&bih=1003&sxsrf=ANbL-n7Wm9Ej8pCZQRyRtJoxL21-mKgTnQ%3A1777153692944&ei=nDbtaeuuOeWh5NoPy9vioQ4&ved=0ahUKEwjr7NC0_YmUAxXlEFkFHcutOOQQ4dUDCBE&uact=5&oq=How+can+you+implement+a+retry+mechanism+for+fetching+data+in+javascript%3F&gs_lp=Egxnd3Mtd2l6LXNlcnAiSEhvdyBjYW4geW91IGltcGxlbWVudCBhIHJldHJ5IG1lY2hhbmlzbSBmb3IgZmV0Y2hpbmcgZGF0YSBpbiBqYXZhc2NyaXB0P0i-QlAAWJQxcAB4AZABAJgBZqAB7QeqAQQxNi4xuAEDyAEA-AEC-AEBmAIEoAK_AsICBRAhGKABwgIFECEYqwKYAwCSBwMzLjGgB4sjsgcDMy4xuAe_AsIHBTAuMS4zyAcMgAgB&sclient=gws-wiz-serp'
                  )
                }
                variant="link"
              >
                Answer
              </Button>
            </li>
            <li>
              Implement a delay. Write a function that waits for 10 seconds using a Promise. Deep
              clone an object. Constraint: Your solution must accurately handle objects, arrays,
              null, and undefined. Convert a nested object into a flat key-value pair dictionary.
              Explain inheritance in JavaScript. How do you implement it using ES5 syntax? Implement
              an infinitely curried addition function. Example: console.log(add(1)(2)(3)(4))
              Constraint: Implement this both with and without extra empty parentheses at the end.
              <br />
              <Button
                className="cursor-pointer text-blue-500 underline"
                onClick={() =>
                  setAnswerUrl(
                    'https://www.google.com/search?igu=1&q=Implement+a+delay.+Write+a+function+that+waits+for+10+seconds+using+a+Promise.+Deep%0D%0A++++++++++++++clone+an+object.+Constraint%3A+Your+solution+must+accurately+handle+objects%2C+arrays%2C%0D%0A++++++++++++++null%2C+and+undefined.+Convert+a+nested+object+into+a+flat+key-value+pair+dictionary.%0D%0A++++++++++++++Explain+inheritance+in+JavaScript.+How+do+you+implement+it+using+ES5+syntax%3F+Implement%0D%0A++++++++++++++an+infinitely+curried+addition+function.+Example%3A+console.log%28add%281%29%282%29%283%29%284%29%29%0D%0A++++++++++++++Constraint%3A+Implement+this+both+with+and+without+extra+empty+parentheses+at+the+end.&sca_esv=6386fee4484b402e&biw=1855&bih=1003&sxsrf=ANbL-n71qiEP70Bv0E0ewcYX5tdXnU6zcw%3A1777153724274&ei=vDbtabG0ENnU5NoPlbm9qQE&ved=0ahUKEwixgsnD_YmUAxVZKlkFHZVcLxUQ4dUDCBE&uact=5&oq=Implement+a+delay.+Write+a+function+that+waits+for=10+seconds+using+a+Promise.' +
                      '&sca_esv=6386fee4484b402e&biw=1855&bih=1003&sxsrf=ANbL-n71qiEP70Bv0E0ewcYX5tdXnU6zcw%3A1777153724274&ei=vDbtabG0ENnU5NoPlbm9qQE&ved=0ahUKEwixgsnD_YmUAxVZKlkFHZVcLxUQ4dUDCBE&uact=5&oq=Implement+a+delay.+Write+a+function+that+waits+for=10+seconds+using+a+Promise.'
                  )
                }
                variant="link"
              >
                Answer
              </Button>
            </li>
          </ul>
        </Card>
        <Card className="my-4 p-4">
          <h1 className="text-lg font-bold">Part 3: The Deep End (Advanced)</h1>
          <p>
            Welcome to the heavyweights. These questions are frequently asked by companies like
            Rippling, Uber, and Amazon. They test your architectural thinking, concurrency
            management, and algorithmic optimization.
          </p>
          <ul className="list-inside list-decimal">
            <li>
              Design an LRU Cache for Autocomplete The Problem: Design a caching system for an
              autocomplete feature using a Least Recently Used (LRU) eviction policy. The goal is to
              minimize repetitive API calls by storing recent search queries. When the cache reaches
              its maximum capacity, it must remove the least recently accessed item before adding a
              new one.
              <br />
              <Button
                className="cursor-pointer text-blue-500 underline"
                onClick={() =>
                  setAnswerUrl(
                    'https://www.google.com/search?igu=1&q=Design+an+LRU+Cache+for+Autocomplete+The+Problem%3A+Design+a+caching+system+for+an%0D%0A++++++++++++++autocomplete+feature+using+a+Least+Recently+Used+%28LRU%29+eviction+policy.+The+goal+is+to%0D%0A++++++++++++++minimize+repetitive+API+calls+by+storing+recent+search+queries.+When+the+cache+reaches%0D%0A++++++++++++++its+maximum+capacity%2C+it+must+remove+the+least+recently+accessed+item+before+adding+a%0D%0A++++++++++++++new+one.&sca_esv=6386fee4484b402e&biw=1855&bih=1003&sxsrf=ANbL-n6f7wmtzDu26t9_EWgisg6wQwUDTg%3A1777153776155&ei=8DbtafKUCdKgiLMP8IG6SQ&ved=0ahUKEwjyzKfc_YmUAxVSEGIAHfCALgkQ4dUDCBE&uact=5&oq=Design+an+LRU+Cache+for+Autocomplete+The+Problem%3A+Design+a+caching+system+for+an%0D%0A++++++++++++++autocomplete+feature+using+a+Least+Recently+Used+%28LRU%29+eviction+policy.+The+goal+is+to%0D%0A++++++++++++++minimize+repetitive+API+calls+by+storing+recent+search+queries.+When+the+cache+reaches%0D%0A++++++++++++++its+maximum+capacity%2C+it+must+remove+the+least+recently+accessed+item+before+adding+a%0D%0A++++++++++++++new+one.&gs_lp=Egxnd3Mtd2l6LXNlcnAilQNEZXNpZ24gYW4gTFJVIENhY2hlIGZvciBBdXRvY29tcGxldGUgVGhlIFByb2JsZW06IERlc2lnbiBhIGNhY2hpbmcgc3lzdGVtIGZvciBhbgogICAgICAgICAgICAgIGF1dG9jb21wbGV0ZSBmZWF0dXJlIHVzaW5nIGEgTGVhc3QgUmVjZW50bHkgVXNlZCAoTFJVKSBldmljdGlvbiBwb2xpY3kuIFRoZSBnb2FsIGlzIHRvCiAgICAgICAgICAgICAgbWluaW1pemUgcmVwZXRpdGl2ZSBBUEkgY2FsbHMgYnkgc3RvcmluZyByZWNlbnQgc2VhcmNoIHF1ZXJpZXMuIFdoZW4gdGhlIGNhY2hlIHJlYWNoZXMKICAgICAgICAgICAgICBpdHMgbWF4aW11bSBjYXBhY2l0eSwgaXQgbXVzdCByZW1vdmUgdGhlIGxlYXN0IHJlY2VudGx5IGFjY2Vzc2VkIGl0ZW0gYmVmb3JlIGFkZGluZyBhCiAgICAgICAgICAgICAgbmV3IG9uZS4yBxAjGOoCGCcyBxAjGOoCGCcyBxAjGOoCGCcyBxAjGOoCGCcyBxAjGOoCGCcyBxAjGOoCGCcyBxAjGOoCGCcyFxAAGIAEGIoFGJECGOcGGOoCGLQC2AEBMhcQABiABBiKBRiRAhjnBhjqAhi0AtgBATIXEAAYgAQYigUYkQIY5wYY6gIYtALYAQEyFxAAGIAEGIoFGJECGOcGGOoCGLQC2AEBMhcQABiABBiKBRiRAhjnBhjqAhi0AtgBATIQEC4YAxiPARjqAhi0AtgBATIQEAAYAxiPARjqAhi0AtgBATIQEAAYAxiPARjqAhi0AtgBATIQEAAYAxiPARjqAhi0AtgBATIQEAAYAxiPARjqAhi0AtgBAUjzDVChA1ihA3ABeAGQAQCYAQCgAQCqAQC4AQPIAQD4AQH4AQKYAgGgAgWoAhSYAwXxBZkl6yHEagJOugYGCAEQARgBkgcBMaAHALIHALgHAMIHAzItMcgHBIAIAQ&sclient=gws-wiz-serp'
                  )
                }
                variant="link"
              >
                Answer
              </Button>
            </li>
            <li>
              The Problem: You are given a set of asynchronous tasks. Some tasks have dependencies
              (they cannot start until their prerequisites finish). Write a scheduler function that
              executes these tasks in parallel while adhering to two rules: Dependency Resolution: A
              task may only begin once all of its prerequisite tasks have successfully completed.
              Concurrency Limit: No more than N tasks can be running at the same time.
              <br />
              <Button
                className="cursor-pointer text-blue-500 underline"
                onClick={() =>
                  setAnswerUrl(
                    'https://www.google.com/search?igu=1&q=The+Problem%3A+You+are+given+a+set+of+asynchronous+tasks.+Some+tasks+have+dependencies%0D%0A++++++++++++++%28they+cannot+start+until+their+prerequisites+finish%29.+Write+a+scheduler+function+that%0D%0A++++++++++++++executes+these+tasks+in+parallel+while+adhering+to+two+rules%3A+Dependency+Resolution%3A+A%0D%0A++++++++++++++task+may+only+begin+once+all+of+its+prerequisite+tasks+have+successfully+completed.%0D%0A++++++++++++++Concurrency+Limit%3A+No+more+than+N+tasks+can+be=running+at+the+same=time.&sca_esv=6386fee4484b402e&biw=1855&bih=1003&sxsrf=ANbL-n5exNfJpEuendOXqmGtyl13RA8gBw%3A1777153813187&ei=FTftacuOC_ay5NoP3PygmQE&ved=0ahUKEwiL7fvt_YmUAxV2GVkFHVw-KBMQ4dUDCBE&uact=5&oq=The+Problem%3A+You+are=given+a=set=of=asynchronous=tasks.+Some=tasks=have=dependencies%0D%0A++++++++++++++%28they=cannot=start=until=their=prerequisites=finish%29.+Write=a=scheduler=function=that%0D%0A++++++++++++++executes=these=tasks=in=parallel=while=adhering=to=two=rules%3A=Dependency=Resolution%3A=A%0D%0A++++++++++++++task=may=only begin once all of its prerequisite tasks have successfully completed.%0D%0A++++++++++++++Concurrency Limit: No more than N tasks can be running at the same time.&gs_lp=Egxnd3Mtd2l6LXNlcnAi1gNUaGUgUHJvYmxlbTogWW91IGFyZSBnaXZlbiBhIHNldCBvZiBhc3luY2hyb25vdXMgdGFza3MuIFNvbWUgdGFza3MgaGF2ZSBkZXBlbmRlbmNpZXMKICAgICAgICAgICAgICAodGhleSBjYW5ub3Qgc3RhcnQgdW50aWwgdGhlaXIgcHJlcmVxdWlzaXRlcyBmaW5pc2gpLiBXcml0ZSBhIHNjaGVkdWxlciBmdW5jdGlvbiB0aGF0CiAgICAgICAgICAgICAgZXhlY3V0ZXMgdGhlc2UgdGFza3MgaW4gcGFyYWxsZWwgd2hpbGUgYWRoZXJpbmcgdG8gdHdvIHJ1bGVzOiBEZXBlbmRlbmN5IFJlc29sdXRpb246IEEKICAgICAgICAgICAgICB0YXNrIG1heSBvbmx5IGJlZ2luIG9uY2UgYWxsIG9mIGl0cyBwcmVyZXF1aXNpdGUgdGFza3MgaGF2ZSBzdWNjZXNzZnVsbHkgY29tcGxldGVkLgogICAgICAgICAgICAgIENvbmN1cnJlbmN5IExpbWl0OiBObyBtb3JlIHRoYW4gTiB0YXNrcyBjYW4gYmUgcnVubmluZyBhdCB0aGUgc2FtZSB0aW1lLjIHECMY6gIYJzIHECMY6gIYJzIHECMY6gIYJzIHECMY6gIYJzIHECMY6gIYJzIHECMY6gIYJzIHECMY6gIYJzIHECMY6gIYJzIHECMY6gIYJzIXEAAYgAQYigUYkQIY5wYY6gIYtALYAQEyFxAAGIAEGIoFGJECGOcGGOoCGLQC2AEBMhcQABiABBiKBRiRAhjnBhjqAhi0AtgBATIXEAAYgAQYigUYkQIY5wYY6gIYtALYAQEyFxAAGIAEGIoFGJECGOcGGOoCGLQC2AEBMhcQABiABBiKBRiRAhjnBhjqAhi0AtgBAUj-ClDwAljwAnABeAGQAQCYAQCgAQCqAQC4AQPIAQD4AQH4AQKYAgGgAgWoAhSYAwXxBZkl6yHEagJOugYGCAEQARgBkgcBMaAHALIHALgHAMIHAzItMcgHBIAIAQ&sclient=gws-wiz-serp'
                  )
                }
                variant="link"
              >
                Answer
              </Button>
            </li>
            <li>
              The Problem: Write a utility function called mapLimit that maps an array of inputs to
              an array of outputs using an asynchronous iteratee function. The function must
              restrict the maximum number of asynchronous operations running concurrently. Technical
              Requirements: Concurrency: Active executions must never exceed the limit. Order
              Preservation: Outputs must be in the exact same order as the original inputs array.
              Execution: As soon as one task finishes, the next queued task must immediately begin.
              <br />
              <Button
                className="cursor-pointer text-blue-500 underline"
                onClick={() =>
                  setAnswerUrl(
                    'https://www.google.com/search?igu=1&q=The+Problem%3A+Write+a+utility+function+called+mapLimit+that+maps+an+array+of+inputs+to%0D%0A++++++++++++++an+array+of+outputs+using+an+asynchronous+iteratee+function.+The+function+must%0D%0A++++++++++++++restrict+the+maximum+number+of+asynchronous+operations+running+concurrently.+Technical%0D%0A++++++++++++++Requirements%3A+Concurrency%3A+Active+executions+must+never+exceed+the+limit.+Order%0D%0A++++++++++++++Preservation%3A+Outputs+must+be+in+the+exact+same+order+as+the+original+inputs+array.%0D%0A++++++++++++++Execution%3A+As=0ahUKEwi49veF_omUAxXxD1kFHS7qBkIQ4dUDCBE&uact=5&oq=The+Problem%3A+Write+a+utility+function+called+mapLimit+that+maps+an+array +of +inputs +to%0D%0A++++++++++++++an +array +of +outputs +using +an +asynchronous +iteratee +function.+The +function +must%0D%0A++++++++++++++restrict +the +maximum +number +of +asynchronous +operations +running +concurrently.+Technical%0D%0A++++++++++++++Requirements%3A +Concurrency%3A +Active +executions +must +never +exceed +the +limit.+Order%0D%0A++++++++++++++Preservation%3A +Outputs +must +be +in +the +exact +same +order +as +the +original +inputs +array.%0D%0A++++++++++++++Execution%3A +As +soon +as +one +task +finishes%2C +the +#next +#queued +#task +#must +#immediately +#begin.&gs_lp=Egxnd3Mtd2l6LXNlcnAiuwRUaGUgUHJvYmxlbTogV3JpdGUgYSB1dGlsaXR5IGZ1bmN0aW9uIGNhbGxlZCBtYXBMaW1pdCB0aGF0IG1hcHMgYW4gYXJyYXkgb2YgaW5wdXRzIHRvCiAgICAgICAgICAgICAgYW4gYXJyYXkgb2Ygb3V0cHV0cyB1c2luZyBhbiBhc3luY2hyb25vdXMgaXRlcmF0ZWUgZnVuY3Rpb24uIFRoZSBmdW5jdGlvbiBtdXN0CiAgICAgICAgICAgICAgcmVzdHJpY3QgdGhlIG1heGltdW0gbnVtYmVyIG9mIGFzeW5jaHJvbm91cyBvcGVyYXRpb25zIHJ1bm5pbmcgY29uY3VycmVudGx5LiBUZWNobmljYWwKICAgICAgICAgICAgICBSZXF1aXJlbWVudHM6IENvbmN1cnJlbmN5OiBBY3RpdmUgZXhlY3V0aW9ucyBtdXN0IG5ldmVyIGV4Y2VlZCB0aGUgbGltaXQuIE9yZGVyCiAgICAgICAgICAgICAgUHJlc2VydmF0aW9uOiBPdXRwdXRzIG11c3QgYmUgaW4gdGhlIGV4YWN0IHNhbWUgb3JkZXIgYXMgdGhlIG9yaWdpbmFsIGlucHV0cyBhcnJheS4KICAgICAgICAgICAgICBFeGVjdXRpb246IEFzIHNvb24gYXMgb25lIHRhc2sgZmluaXNoZXMsIHRoZSBuZXh0IHF1ZXVlZCB0YXNrIG11c3QgaW1tZWRpYXRlbHkgYmVnaW4uMgcQIxjqAhgnMgcQIxjqAhgnMgcQIxjqAhgnMgcQIxjqAhgnMgcQIxjqAhgnMgcQIxjqAhgnMgcQIxjqAhgnMgcQIxjqAhgnMgcQIxjqAhgnMhcQABiABBiKBRiRAhjnBhjqAhi0AtgBATIXEAAYgAQYigUYkQIY5wYY6gIYtALYAQEyEBAAGAMYjwEY6gIYtALYAQEyEBAAGAMYjwEY6gIYtALYAQEyEBAAGAMYjwEY6gIYtALYAQEyEBAAGAMYjwEY6gIYtALYAQFImQpQ_gJY_gJwAXgBkAEAmAEAoAEAqgEAuAEDyAEA-AEB-AECmAIBoAIFqAIRmAMF8QWy-WAf6NvBbroGBggBEAEYAZIHATGgBwCyBwC4BwDCBwMyLTHIBwSACAE&sclient=gws-wiz-serp'
                  )
                }
                variant="link"
              >
                Answer
              </Button>
            </li>
          </ul>
        </Card>
      </div>
      {answerUrl && (
        <div className="mx-10 grid w-200 gap-8 p-8">
          <Iframe
            url={answerUrl}
            width="100%"
            height="100%"
            sandbox={['allow-scripts', 'allow-same-origin']}
            title="Library Iframe"
          />
        </div>
      )}
    </div>
  )
}

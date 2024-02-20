

# Guide to React development 

## 1.  Functional typescript components

We prefer using typescript functional components (plain functions) which are 
much easier to read and test than class components. When you have to edit a 
js component, you should migrate it to typescript by **making sure it follows this guide.**

When creating typescript react components **do not use** the  **`React.FC`**  type because:

1. Our  components will accept a **`children`** prop, even though we don't do anything with it
2. You can't use generics. Not super common, but definitely a downside.
3. We have to use a function expression and can't use a function declaration.
4. There are a few other smaller issues laid out in **[this GitHub issue](https://github.com/facebook/create-react-app/pull/8177)**
- **code examples**
    
    ```ts
    // Don't
    const Calculator: React.FC<CalculatorProps> = ({left, right, operator}) => {
      ...
    }
    
    // Do
    function Calculator({{left, right, operator}:CalculatorProps){
    	...
    
    ```
    

Instead, we use a children prop **`children: React.ReactNode`** you can find examples below.

**Make sure to type everything inside the component** this includes `useState`, values returned by `useSelector` if the selector function does not have a return type set, and all the other variables and functions inside of the component.

- **code examples**
    
    ```ts
     /**
     * Display recommended number of panels for a net zero system.
     *
     * @Component
     */
    export default function NetZeroRecommendation() {
        const {
            id,
            annualPowerConsumptionKwH
        }: { id: number; annualPowerConsumptionKwH: number } = useSelector(getSelectedProject)
        const quoteId: number = useSelector(getSelectedQuoteId)
        const systemId: number | null = useSelector(getSelectedSystem)?.id
    
        const [recommendationStatus, setRecommendationStatus] =
            useState<RecommendationStatus | null>(null)
    
        const handleSubmit = (ev: React.FormEvent<HTMLFormElement>) => {
            ev.preventDefault()
            console.log(ev)
        }
    ....
    ```
    

## 2.  Props

For props, we are using types instead of interfaces, a type alias feels like a more appropriate language construct for plainly defining what the shape of an object should look like and is more akin to functional-style programming, so it feels more at home with React.

- **code examples**
    
    common examples:
    
    ```ts
    type AppProps = {
      message: string;
      count: number;
      disabled: boolean;
      /** array of a type! */
      names: string[];
      /** string literals to specify exact string values, with a union type to join them together */
      status: "waiting" | "success";
      /** any object as long as you dont use its properties (NOT COMMON but useful as placeholder) */
      obj: object;
      obj2: {}; // almost the same as `object`, exactly the same as `Object`
      /** an object with any number of properties (PREFERRED) */
      obj3: {
        id: string;
        title: string;
      };
      /** array of objects! (common) */
      objArr: {
        id: string;
        title: string;
      }[];
      /** a dict object with any number of properties of the same type */
      dict1: {
        [key: string]: MyTypeHere;
      };
      dict2: Record<string, MyTypeHere>; // equivalent to dict1
      /** any function as long as you don't invoke it (not recommended) */
      onSomething: Function;
      /** function that doesn't take or return anything (VERY COMMON-recommended) */
      onClick: () => void;
      /** function with named prop (VERY COMMON) */
      onChange: (id: number) => void;
      /** function type syntax that takes an event (VERY COMMON) */
      onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
      /** alternative function type syntax that takes an event (VERY COMMON) */
      onClick(event: React.MouseEvent<HTMLButtonElement>): void;
      /** alternative function type syntax for event handlers*/
      onClick2: React.MouseEventHandler<HTMLButtonElement>;
      /** an optional prop (VERY COMMON!) */
      optional?: OptionalType;
    };
    ```
    
    children prop:
    
    ```ts
    type Props = {
      children1: JSX.Element; // bad, doesnt account for arrays
      children2: JSX.Element | JSX.Element[]; // meh, doesn't accept strings
      children3: React.ReactChildren; // despite the name, not at all an appropriate type; it is a utility
      children4: React.ReactChild[]; // better, accepts array children
      children: React.ReactNode; // best, accepts everything (see edge case below)
    };
    ```
    
    Defaults for propTypes should be added inside the function signature:
    
    ```ts
    export default function MyComponent({ label = "foobar" }: MyProps) {
    	 ...
    };
    ```
    
    A small but important thing to remember 
    
    ```ts
    type MyType = {
        /**
         * property 1 is optional, but when it is present on an object of type
         * MyType it must be a string
         */
        property1?: string
        /**
         * property 2 is mandatory, so it must be present on an object of type
         * MyType and it can have 2 values, string or undefined
         */
        property2: string | undefined
    }
    ```
    

## 3.  Documenting the component code

If the name of the prop does not give enough information about what is the role of the value, please add documentation for it, make sure to use js doc and not regular comments. Regular comments will not be visible when you hover over the component from another file.

Always add a general description of what the component does and how it can be used

- **code examples**
    
    ```ts
    type MyProps {
      /** Description of prop "label".
       * @default foobar
       * */
      label?: string;
    }
    
    /**
     * General component description in JSDoc format.
     */
    export default function MyComponent({ label = "foobar" }: MyProps) {
      return <div>Hello world {label}</div>;
    }
    ```
    

If you use multiple `useEffect` hooks also document how they change the state of the components and how they might interact with each other.

- **code examples**
    
    ```ts
    // Check if we need to enable "forced" mode.
        useEffect(() => {
            if (project?.installer && project?.installer !== currentInstaller) {
                // The project of the currently open view is different than the
                // installer. Preselect the installer and open the modal.
                setModalOpen(true)
                setPreSelectInstallerId(project.installer)
                if (project.owner?.email) {
                    setProjectUsers({
                        owner: project.owner?.email,
                        creator: project.createdById
                    })
                }
            }
        }, [project])
    
        // Set up keyboard interaction.
        useEffect(() => {
            const handleKeypress = (event) => {
                if ((event.metaKey || event.ctrlKey) && event.key === 'i') {
                    modalOpenRef.current ? closeModal() : setModalOpen(true)
                    event.preventDefault()
                    return false
                }
                if (event.key === 'Escape') {
                    closeModal()
                    event.preventDefault()
                    return false
                }
            }
    
            document.addEventListener('keydown', handleKeypress)
    
            return () => {
                document.removeEventListener('keydown', handleKeypress)
            }
        }, [])
    ```
    

## 4.  Styling

For styling, we using Chakra UI, which means you are not creating components from scratch. Check the Chakra UI documentation


## 5. Unit Testing

When you create a new component or update an old component, make sure that the functionality of the component is well tested. You should always have the perspective of the user in mind and you should not test implementation details (how the component does what is supposed to do). To achieve this we are using  **[React Testing Library](https://github.com/testing-library/react-testing-library).**

Each component has two users:

- **the end-user** who will be interacting with our component in the browser through the rendered buttons and contents.
- **other developers** who will be using the component throughout the app.

### A) **The end-user**

The end-user will see/interact with what we render in the **`render`** method so the test should typically only see/interact with the rendered output.

To search for buttons, inputs and other elements that the user will see on the screen you should use queries, here is a [**list of queries**](https://testing-library.com/docs/queries/about/#priority) that you can use. Please note that the queries have a priority based on the principle of testing from the perspective of the end-user, so keep that in mind when selecting which query to use. `getByTestId` has the **lowest** priority, so you should only use it as a last resort.

To simulate clicking, typing text, and other events, we use [userEvent](https://testing-library.com/docs/user-event/intro/#writing-tests-with-userevent). UserEvent dispatches the same events that would be dispatched if a real user would interact with the document. For example, when you use `userEvent` for simulating the user clicking a button, `userEvent` will also dispatch the event for hovering over the button before clicking.

### B) **Other developers**

Other developers will render the component with props and expect actions to be dispatched to the store or APIs to be called. So you should have a black-box approach to testing components. We put data in through the props and by mocking the selector (inputs) and we check if the right action gets dispatched to the store or if the right API gets called (outputs).

- **code examples**
    
    ```ts
    import userEvent from '@testing-library/user-event'
    import { render, screen } from '@testing-library/react'
    import OutdatedQuoteWarning, {
        WarningTitle,
        WarningMessage
    } from './OutdatedQuoteWarning'
    
    const onUpdateMock = jest.fn()
    
    // 1.Inside of the describe, put the name of the tested component.
    describe('OutdatedQuoteWarning', () => {
        // 2.Describe what the test should verify.
        it('should remove the warning on decline button click', () => {
            // 3.Render the component with expected props.
            render(
                <OutdatedQuoteWarning onUpdate={onUpdateMock}>
                    <WarningTitle>Warning title</WarningTitle>
                    <WarningMessage>This is a warning!</WarningMessage>
                </OutdatedQuoteWarning>
            )
            // 4.Search for buttons and inputs in the same way a user will do it.
            // A button with the text 'abcd'.
            const declineButton = screen.getByRole('button', {
                name: /no, keep it like this/i
            })
    
            // 5.Click on the button using userEvent.
            userEvent.click(declineButton)
    
            // 6.Check that the right content gets displayed on the screen after the
            //button click action (warning is removed).
            expect(screen.queryByText(/warning title/i)).not.toBeInTheDocument()
            expect(screen.queryByText(/this is a warning!/i)).not.toBeInTheDocument()
            // 7.Check that clicking on the decline button only removes the warning
            // and does not accept the changes.
            expect(onUpdateMock).toHaveBeenCalledTimes(0)
        })
        it('should call update function on accept', () => {
            render(
                <OutdatedQuoteWarning onUpdate={onUpdateMock}>
                    <WarningTitle>Warning title</WarningTitle>
                    <WarningMessage>This is a warning!</WarningMessage>
                </OutdatedQuoteWarning>
            )
            // 8.Search for the accept button in the same way a user will do it.
            const acceptButton = screen.getByRole('button', { name: /yes, update/i })
    
            // 9.Click on the accept button.
            userEvent.click(acceptButton)
    
            // 10.test that the component calls the accept method, we do not care
            // how this happens, only that the right method gets called.
            expect(onUpdateMock).toHaveBeenCalledTimes(1)
        })
    })
    ```
    
    ```ts
    import { render, screen } from '@testing-library/react'
    import userEvent from '@testing-library/user-event'
    import { useSelector, dispatch } from 'generic/testing/mockReduxHooks'
    import ElementWarning from './ElementWarning'
    
    const defaultProps = {
        height: 30,
        elementType: 'panels'
    }
    
    describe('ElementWarning', () => {
        it('should show a message', () => {
    				// 1.Mock the store data retrieved by the component
            useSelector.mockReturnValue({ quoteId: 1, isFetchingElements: false })
    				// 2.Render the component with props just like a developer would
    				// in a parent component.
            render(<ElementWarning {...defaultProps} />)
    
    				// 3.Verify that the correct text is displayed based on the props and
    				// store data.
            expect(screen.getByText('Please activate panels')).toBeInTheDocument()
        })
        it('should dispatch refetch action when clicking on the reload icon', () => {
            // 1.Mock the store data retrieved by the component
    				useSelector.mockReturnValue({ quoteId: 1, isFetchingElements: false })
    				// 2.Render the component with props just like a developer would
    				// in a parent component.
            const { rerender } = render(<ElementWarning {...defaultProps} />)
            // 3.Use getByTestId only when no other query would work.
            const reloadIcon = screen.getByTestId('reload')
    				// 4.Click the icon
            userEvent.click(reloadIcon)
    
    				// 5.Validate that the right action gets dispatched and that the
    			  // payload of the action has the right data
            expect(dispatch).toHaveBeenCalledTimes(1)
            expect(dispatch).toHaveBeenCalledWith({
                type: 'EDITOR_ELEMENTS_REFETCH',
                payload: { quoteId: 1 }
            })
        })
    })
    ```
    

    

**Please also have a look at the following 2 articles:**

****[You Probably Don’t Need act() in Your React Tests](https://javascript.plainenglish.io/you-probably-dont-need-act-in-your-react-tests-2a0bcd2ad65c)****

**[Common mistakes with React Testing Library](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library#using-waitfor-to-wait-for-elements-that-can-be-queried-with-find)**

TODO:

1. Why composition is better
    1. [https://www.developerway.com/posts/react-re-renders-guide#part3.1](https://www.developerway.com/posts/react-re-renders-guide#part3.1)
    2. [https://www.developerway.com/posts/react-elements-children-parents](https://www.developerway.com/posts/react-elements-children-parents)